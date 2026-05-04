import sys

def replace_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    target = """                  // 3. Fetch recommendations for top 2 selected videos to avoid hammering the server
                  let allRecs = [];
                  const videosToScan = selectedVideos.slice(0, 3);

                  for (let v of videosToScan) {
                    try {
                      const res = await fetch(`/.netlify/functions/videoDetails?url=${encodeURIComponent(v.url)}`);
                      const data = await res.json();
                      if (data.success && data.recommendedVideos) {
                        trackDiscoveredVideos(data.recommendedVideos);
                        allRecs = [...allRecs, ...data.recommendedVideos];
                      }
                    } catch(e) {}
                  }"""

    replacement = """                  // 3. Fetch recommendations for top 2 selected videos to avoid hammering the server
                  let allRecs = [];
                  const videosToScan = selectedVideos.slice(0, 3);

                  const promises = videosToScan.map(async (v) => {
                    try {
                      const res = await fetch(`/.netlify/functions/videoDetails?url=${encodeURIComponent(v.url)}`);
                      const data = await res.json();
                      if (data.success && data.recommendedVideos) {
                        return data.recommendedVideos;
                      }
                    } catch(e) {}
                    return null;
                  });

                  const results = await Promise.all(promises);
                  results.forEach(recs => {
                    if (recs) {
                      trackDiscoveredVideos(recs);
                      allRecs = [...allRecs, ...recs];
                    }
                  });"""

    if target in content:
        content = content.replace(target, replacement)
        with open(file_path, 'w') as file:
            file.write(content)
        print("Replacement successful.")
    else:
        print("Target string not found.")

if __name__ == "__main__":
    replace_in_file('src/SimpleSearch.js')
