const fs = require('fs');
const content = fs.readFileSync('src/SimpleSearch.js', 'utf8');

const targetStr = `      for (let i = 1; i <= pagesToScrape; i++) {
        setProgressMsg(\`Extrayendo página \${i} de \${pagesToScrape}...\`);

        let url = \`/.netlify/functions/videos?page=\${i}\`;

        if (category) {
          // If a category is selected, we scrape the category page directly
          url += \`&url=\${encodeURIComponent(\`/categories/\${category}/latest/\${i}/\`)}\`;
          // If there is also a text query, append it to let the backend mix them
          if (query.trim()) {
            url += \`&search=\${encodeURIComponent(query)}\`;
          }
        } else {
          url += \`&search=\${encodeURIComponent(query)}\`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          console.warn(\`Error on page \${i}\`);
          break;
        }

        const data = await response.json();
        if (data.videos && data.videos.length > 0) {
           // Prevent duplicates: filter out videos whose URL is already in allVideos
           trackDiscoveredVideos(data.videos);
           const currentVideos = allVideos;
           const newVideos = data.videos.filter(v => !currentVideos.some(existing => existing.url === v.url));
           allVideos = [...allVideos, ...newVideos];
           setResults([...allVideos]); // Update live
           setUnfilteredCount(allVideos.length);
        } else {
          // No more results
          break;
        }
      }`;

const replacementStr = `      setProgressMsg(\`Iniciando extracción de \${pagesToScrape} páginas en paralelo...\`);

      const fetchPromises = [];
      for (let i = 1; i <= pagesToScrape; i++) {
        let url = \`/.netlify/functions/videos?page=\${i}\`;

        if (category) {
          url += \`&url=\${encodeURIComponent(\`/categories/\${category}/latest/\${i}/\`)}\`;
          if (query.trim()) {
            url += \`&search=\${encodeURIComponent(query)}\`;
          }
        } else {
          url += \`&search=\${encodeURIComponent(query)}\`;
        }

        const promise = fetch(url).then(async (response) => {
          if (!response.ok) {
            console.warn(\`Error on page \${i}\`);
            return null;
          }
          return response.json();
        }).catch(err => {
          console.warn(\`Fetch error on page \${i}:\`, err);
          return null;
        });

        fetchPromises.push(promise);
      }

      const resultsArray = await Promise.all(fetchPromises);

      for (const data of resultsArray) {
        if (data && data.videos && data.videos.length > 0) {
          trackDiscoveredVideos(data.videos);
          // using functional update approach for thread-safety to avoid losing items,
          // but we can just accumulate here safely since this is sequential after the await.
          // However, allVideos needs to be updated progressively
          const newVideos = data.videos.filter(v => !allVideos.some(existing => existing.url === v.url));
          allVideos = [...allVideos, ...newVideos];
        }
      }

      setResults(allVideos);
      setUnfilteredCount(allVideos.length);`;

if (content.includes(targetStr)) {
  const newContent = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/SimpleSearch.js', newContent);
  console.log('Successfully updated SimpleSearch.js');
} else {
  console.log('Target string not found');
}
