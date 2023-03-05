import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  // 截图
  await page.screenshot({ path: 'example.png' });

  // 生成pdf
  // await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' });
  // await page.pdf({ path: 'hn.pdf', format: 'A4' });

  await browser.close();
})();
