const fetch = require('node-fetch');
const cheerio = require('cheerio');
async function run() {
  const vRes = await fetch('https://thisvid.com/videos/amateur-getting-a-facial/');
  const vText = await vRes.text();
  const v$ = cheerio.load(vText);
  let mp4Url = '';
  const scriptText = v$('script').filter((i, el) => v$(el).text().includes('.mp4')).text();
  const match = scriptText.match(/(https?:\/\/[^\s"']+\.mp4[^\s"']*)/);
  if (match) {
      mp4Url = match[1];
  }
  console.log("Found MP4?", mp4Url);
}
run();
