import puppeteer from 'puppeteer';
// import { COOKIES_DIR } from '../conf/constant.js';
import { toogleCookies } from '../utils/files.js';

// const cookies = toogleCookies('douban');
// toogleCookies('douban', cookies);

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: {
    width: 1024,
    height: 768,
  },
});
const page = await browser.newPage();
// await page.setCookie(...cookies);
await page.goto('https://www.douban.com/');

/**
  * 计算按钮需要滑动的距离
  * */
// async function calculateDistance(frame) {
//   const distance = await frame.evaluate(() => {
//     // 比较像素,找到缺口的大概位置
//     function compare(document) {
//       const ctx1 = document.querySelector('.tc-fg-item:nth-last-type(1)'); // 完成图片
//       const ctx2 = document.querySelector('#slideBg'); // 带缺口图片
//       const pixelDifference = 30; // 像素差
//       const res = []; // 保存像素差较大的x坐标

//       // 对比像素
//       for (let i = 57; i < 260; i++) {
//         for (let j = 1; j < 160; j++) {
//           const imgData1 = ctx1.getContext('2d').getImageData(1 * i, 1 * j, 1, 1);
//           const imgData2 = ctx2.getContext('2d').getImageData(1 * i, 1 * j, 1, 1);
//           const data1 = imgData1.data;
//           const data2 = imgData2.data;
//           const res1 = Math.abs(data1[0] - data2[0]);
//           const res2 = Math.abs(data1[1] - data2[1]);
//           const res3 = Math.abs(data1[2] - data2[2]);
//           if (!(res1 < pixelDifference && res2 < pixelDifference && res3 < pixelDifference)) {
//             if (!res.includes(i)) {
//               res.push(i);
//             }
//           }
//         }
//       }
//       // 返回像素差最大值跟最小值，经过调试最小值往左小7像素，最大值往左54像素
//       return { min: res[0] - 7, max: res[res.length - 1] - 54 };
//     }
//     return compare(document);
//   });
//   return distance;
// }

/**
  * 计算滑块位置
 */

/**
  * 尝试滑动按钮
  * */

try {
  await page.waitForSelector('#statuses', {
    timeout: 2000,
  });
  // await page.waitForTimeout(30000);

  await page.reload();
  await page.waitForSelector('#statuses', {
    timeout: 2000,
  });

  const cookie = await page.evaluate(() => document.cookie);
  toogleCookies('web-douban', cookie);
} catch (error) {
  // 未登录

  // 获取登录页面
  const login = page.frames().find((framee) => framee.url().includes('login_popup'));
  // 账号密码登录
  await login.click('.account-tab-account');
  await login.waitForSelector('#username');
  // 在搜索框中输入关键词
  await login.type('#username', '137209038@qq.com');
  await login.type('#password', 'ximi140826');
  await login.click('.account-form-field-submit');
  // 滑块验证
  // tcImgArea
  await login.waitForSelector('#tcaptcha_transform_dy');
  const captcha = page.frames().find((framee) => framee.url().includes('drag_ele.html'));
  await captcha.waitForSelector('#tcImgArea');
  // console.log('dis', dis);

  // 二维码扫码
  // await page.screenshot({ path: `${COOKIES_DIR}/www.douban.com.png` });
}

await browser.close();
