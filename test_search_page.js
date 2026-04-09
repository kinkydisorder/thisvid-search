const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function run() {
  const res = await fetch('https://thisvid.com/search/?q=amateur');
  const text = await res.text();
  const $ = cheerio.load(text);

  const firstVideo = $('.tumbpu').first();
  console.log("HTML of first video:", firstVideo.html());
}
run();
