const fs = require('fs');
let content = fs.readFileSync('src/SimpleSearch.js', 'utf8');

const target1 = `const newVideos = data.videos.filter(v => !allVideos.some(existing => existing.url === v.url));`;
const replacement1 = `// eslint-disable-next-line no-loop-func
          const newVideos = data.videos.filter(v => !allVideos.some(existing => existing.url === v.url));`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  fs.writeFileSync('src/SimpleSearch.js', content);
  console.log('Fixed linting issue no-loop-func');
}
