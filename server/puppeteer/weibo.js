import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();
await page.setViewport({
  width: 800,
  height: 680,
});
// await page.goto('https://weibo.com/');

// page.waitForSelector('.gn_login li + li a');
// page.click('.gn_login li + li a');
