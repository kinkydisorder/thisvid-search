const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function run() {
  const res = await fetch('https://thisvid.com/search/?q=amateur');
  const text = await res.text();
  const $ = cheerio.load(text);

  let totalResults = 0;
  const headline = $('.headline').text().trim() || $('.sort-by').text().trim() || $('h1').text().trim();
  console.log("Headline:", headline);
  const matchTotal = headline.match(/of\s+([\d,]+)/i) || headline.match(/([\d,]+)\s+videos/i);
  if (matchTotal) {
    totalResults = parseInt(matchTotal[1].replace(/,/g, ''), 10);
  }
  console.log("Total:", totalResults);
}
run();
