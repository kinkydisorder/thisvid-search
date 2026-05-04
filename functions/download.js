const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-extra');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
const adBlocker = AdBlockerPlugin({
  blockTrackers: true,
});
puppeteer.use(adBlocker);

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=31536000',
  'Netlify-Vary': 'query',
};

exports.handler = async function (event, context) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ status: 'Bad Request', message: 'Missing url query parameter' }) };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url, 'https://thisvid.com');
    if (parsedUrl.hostname !== 'thisvid.com' && parsedUrl.hostname !== 'www.thisvid.com') throw new Error('Invalid hostname');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ status: 'Bad Request', message: 'Invalid url query parameter' }) };
  }
  
  const safeUrl = parsedUrl.href;
  const options = { executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()) };

  if (!process.env.CHROME_EXECUTABLE_PATH) {
    options.args = chromium.args;
    options.defaultViewport = chromium.defaultViewport;
    options.headless = chromium.headless;
  }

  let browser;
  try {
      browser = await puppeteer.launch(options);
      const page = await browser.newPage();
      let finalEmbedUrl = safeUrl;

      // Bypass friends-only private walls via Embed
      const fetch = require('node-fetch');
      const res = await fetch(safeUrl);
      const text = await res.text();
      const idMatch = text.match(/video_id\s*[:=]\s*['"]?(\d+)['"]?/i) || text.match(/embed\/(\d+)/i) || text.match(/itemid: (\d+)/i);
      
      if (idMatch && idMatch[1]) {
          finalEmbedUrl = `https://thisvid.com/embed/${idMatch[1]}/`;
      }
      
      await page.goto(finalEmbedUrl);
      await page.waitForSelector('video', { timeout: 15000 });
      
      const videoUrl = await page.evaluate(() => {
        const v = document.querySelector('video');
        if (!v) return null;
        if (v.src && v.src !== "") return v.src;
        const source = v.querySelector('source');
        if (source && source.src) return source.src;
        return null;
      });

      await browser.close();
      if (!videoUrl) return { statusCode: 500, body: JSON.stringify({ status: 'Error', message: 'Could not find video URL' }) };
      return { statusCode: 200, body: JSON.stringify({ videoUrl }), headers };
  } catch(e) {
      if (browser) await browser.close();
      return { statusCode: 500, body: JSON.stringify({ status: 'Error', message: 'An internal error occurred while processing the request' }) };
  }
};
