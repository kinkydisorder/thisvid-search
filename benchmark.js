const { performance } = require('perf_hooks');

const selectedVideos = [
  { url: 'video1' },
  { url: 'video2' },
  { url: 'video3' }
];

const mockFetch = async (url) => {
  // Simulate network delay of 200ms
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    json: async () => ({
      success: true,
      recommendedVideos: [{ url: url + '-rec1' }, { url: url + '-rec2' }]
    })
  };
};

const trackDiscoveredVideos = () => {};

async function runSequential() {
  const start = performance.now();
  let allRecs = [];
  const videosToScan = selectedVideos.slice(0, 3);

  for (let v of videosToScan) {
    try {
      const res = await mockFetch(`/.netlify/functions/videoDetails?url=${encodeURIComponent(v.url)}`);
      const data = await res.json();
      if (data.success && data.recommendedVideos) {
        trackDiscoveredVideos(data.recommendedVideos);
        allRecs = [...allRecs, ...data.recommendedVideos];
      }
    } catch(e) {}
  }
  const end = performance.now();
  return { time: end - start, recs: allRecs };
}

async function runParallel() {
  const start = performance.now();
  let allRecs = [];
  const videosToScan = selectedVideos.slice(0, 3);

  const promises = videosToScan.map(async (v) => {
    try {
      const res = await mockFetch(`/.netlify/functions/videoDetails?url=${encodeURIComponent(v.url)}`);
      const data = await res.json();
      if (data.success && data.recommendedVideos) {
        return data.recommendedVideos;
      }
    } catch(e) {}
    return null;
  });

  const results = await Promise.all(promises);
  for (const recs of results) {
    if (recs) {
      trackDiscoveredVideos(recs);
      allRecs = [...allRecs, ...recs];
    }
  }

  const end = performance.now();
  return { time: end - start, recs: allRecs };
}

async function main() {
  console.log("Running baseline (sequential)...");
  const seqRes = await runSequential();
  console.log(`Sequential time: ${seqRes.time.toFixed(2)}ms`);

  console.log("\nRunning optimized (parallel)...");
  const parRes = await runParallel();
  console.log(`Parallel time: ${parRes.time.toFixed(2)}ms`);

  console.log(`\nImprovement: ${((seqRes.time - parRes.time) / seqRes.time * 100).toFixed(2)}% faster`);
}

main();
