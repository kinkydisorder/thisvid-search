const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function run() {
  const res = await fetch('https://thisvid.com/search/?q=amateur');
  const text = await res.text();
  const $ = cheerio.load(text);

  console.log("Total results text:", $('.sort-by').text().trim() || $('.headline').text().trim() || $('h1').text().trim());

  const firstVideoHref = $('.tumbpu').first().attr('href');
  console.log("First video:", firstVideoHref);

  if (firstVideoHref) {
    const vRes = await fetch(firstVideoHref);
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
}
run();
