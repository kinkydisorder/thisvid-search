const fetch = require('node-fetch');
async function run() {
  const avatar = "https://media.thisvid.com/contents/videos_screenshots/14086000/14086537/240x180/2.jpg";
  const preview = avatar.replace(/\/[^/]+\.jpg$/, '/preview.mp4');
  console.log("Trying", preview);
  const res = await fetch(preview, { method: 'HEAD' });
  console.log("Status", res.status);
}
run();
