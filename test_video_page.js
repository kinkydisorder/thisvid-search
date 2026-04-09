const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function run() {
  const vRes = await fetch('https://thisvid.com/videos/amateur-getting-a-facial/');
  const vText = await vRes.text();
  const v$ = cheerio.load(vText);

  let downloadUrl = v$('a.download').attr('href') || v$('a:contains("Download")').attr('href');
  console.log("Download link:", downloadUrl);
}
run();
