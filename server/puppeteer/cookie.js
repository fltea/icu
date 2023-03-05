import puppeteer from 'puppeteer';
import { toogleCookies } from '../utils/puppeteer.js';

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: {
    width: 1024,
    height: 768,
  },
});
const page = await browser.newPage();
await page.goto('https://www.douban.com/');

console.log('waitForSelector');
await page.waitForSelector('.login');
// console.log('page frames', page.mainFrame());
// console.log('page frames');
// page.frames().forEach((frame) => {
//   console.log(frame.url());
// });
const login = page.frames().find((framee) => framee.url().includes('login_popup'));
if (!login) {
  await browser.close();
}

await login.click('.account-tab-account');
await login.waitForSelector('#username');
// 在搜索框中输入关键词
await login.type('#username', '137209038@qq.com');
await login.type('#password', 'ximi140826');
await login.click('.account-form-field-submit');

// statuses
await page.waitForSelector('#statuses');

const cookies = await page.cookies();
console.log('Page.cookies()', cookies);
toogleCookies('douban', cookies);
