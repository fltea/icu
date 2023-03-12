import puppeteer from 'puppeteer';
import { sleep } from '../utils/tools.js';

let browser;
let timer;
let closing;
let opening;

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
  if (opening) {
    await sleep(10000);
  }
  if (closing || !browser) {
    opening = true;
    browser = await puppeteer.launch({ headless: false });
    opening = false;
  }
  const page = await browser.newPage();
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
