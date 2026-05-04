// simple mock benchmark
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ videos: [{url: '/video' + Math.random()}] }));
  }, 100);
});

server.listen(4000, async () => {
  // Wait a moment for server
  await new Promise(r => setTimeout(r, 100));

  const startSeq = Date.now();
  for (let i = 1; i <= 10; i++) {
    const res = await fetch(`http://localhost:4000/videos?page=${i}`);
    await res.json();
  }
  const endSeq = Date.now();
  console.log(`Sequential: ${endSeq - startSeq}ms`);

  const startPar = Date.now();
  const promises = [];
  for (let i = 1; i <= 10; i++) {
    promises.push(fetch(`http://localhost:4000/videos?page=${i}`).then(r => r.json()));
  }
  await Promise.all(promises);
  const endPar = Date.now();
  console.log(`Parallel: ${endPar - startPar}ms`);

  server.close();
  process.exit(0);
});
