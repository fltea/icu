import puppeteer from 'puppeteer';

let browser;
let timer;
let closing;

async function closeBrowser() {
  if (browser) {
    closing = true;
    await browser.close();
    browser = null;
    closing = false;
  }
}

async function requst({ url, selector }) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  let page;
  if (closing || !browser) {
    browser = await puppeteer.launch({ headless: false });
    const pages = await browser.pages();
    [page] = pages.slice(0, 1);
  } else {
    page = await browser.newPage();
  }
  await page.goto(url);
  await page.waitForSelector(selector, {
    timeout: 10000,
  });
  const html = await page.evaluate(() => document.documentElement.innerHTML);
  await page.close();
  timer = setTimeout(closeBrowser, 3 * 60 * 1000);

  return html;
}

export default requst;
