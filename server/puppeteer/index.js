import puppeteer from 'puppeteer';
// import puppeteer, { KnownDevices } from 'puppeteer';

// const iPhone = KnownDevices['iPhone 6'];

const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();
// await page.emulate(iPhone);
// await page.goto('https://m.weibo.cn/');
// await page.screenshot({ path: 'example.png' });
// await page.pdf({ path: 'example.pdf', format: 'A4' });
// page.waitForSelector('.m-btn.m-btn-blue.login-btn');
// page.click('.m-btn.m-btn-blue.login-btn');

// await page.waitForSelector('.verify-box .box-center');
// await page.click('.box-center a');

// await page.waitForRequest(
//   (request) => request.url().includes('https://passport.weibo.cn'),
// );
// await page.waitForTimeout(2000);

// https://passport.weibo.cn/signin/login
// await page.goto('https://passport.weibo.cn/signin/login');

// // 1593066705@qq.com
// // ximi140826
// const config = {
//   username: '1593066705@qq.com',
//   password: 'ximi140826',
// };
// await page.waitForSelector('#loginAction');

// await page.evaluate((c) => {
//   document.querySelector('#loginName').value = c.username;
//   document.querySelector('#loginPassword').value = c.password;
//   document.querySelector('#loginAction').click();
// }, config);

// const input = await page.$('#loginName');
// console.log(input);
// await input.evaluate((b) => b.focus());
// await page.keyboard.type('1593066705@qq.com');
// await page.click('#loginPassword');
// await page.keyboard.type('ximi140826');
// await page.click('#loginAction');

// await page.goto('https://m.weibo.cn/');
// eslint-disable-next-line max-len
// await page.setCookie('_ga=GA1.2.2070977570.1640746193; OUTFOX_SEARCH_USER_ID_NCOO=1431324063.1931155; __bid_n=183f9931fb0dd5e3ad4207; FPTOKEN=30$dtyE7VquLgawOZBPQ1XIqsdCJ6ZKfL5KhqUgxgil80AffVdOda/zywIJuCNSghnCecFr3aEvRIUTge2IWyxg5/SZ8P32Ocw1x4MwEkkaEVbJ64gbn2orhljM7osMCa/+VR3ur+Cw9JyKZ2EA7JE09c1FyID/5ze/Hmp614RIk/VWkgalcvA6UoyzhYQc2jHBQFz+EBLPSC18i5YuTb53rLwfap82Au614CESRZuRcuFgrIzRAHB2M0kavJtfuy89hiL+X5FPEYAszPTxdqPlqR3BKp+di/JsBo7hGTiip5FKBuTa3qJXJJ/0Dj7LEyergz9b/iIFGgAFrL2/kVWgAqaWkJrGrGa2KCKvGCi6QkogW58DnDGELxRLJ8BNXsTA|0sPcBU5/IvQuUNMP8fU80Dec0UDqgDGiUO6rHwjbRGs=|10|359ffd2d9a5b6e65b3cfcd2b951403b5; FEID=v10-b70b2d735a1389ed32df2f11b9668c444896a67f; __xaf_thstime__=1672900161046; __xaf_fpstarttimer__=1672900161408; __xaf_fptokentimer__=1672900161488; WEIBOCN_FROM=1110006030; BAIDU_SSP_lcr=https://login.sina.com.cn/; _T_WM=38559071378; SCF=Akt6J6V7kEvA6hPJ2P2Mtpr0KoSJ4f7kQ2qzjoXXPYftF8Jy63X-HKIB4-f-4L2-C40nK96pdyyN6kZ3FzQ5gTA.; SUB=_2A25O7pZBDeRhGeRK71MV8C7Ewj-IHXVqEDoJrDV6PUJbktANLRnxkW1NU1o8gRzQ7cXjNOGkEuZ8KfzhwtAcwTpM; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFBSyR4EMSbMPkfs4ydBs3Y5JpX5K-hUgL.FozXSh2Xeh5R1Ke2dJLoIN-LxKqL1hnL1K2LxKML1-2L1hBLxKnL1hBL1K2LxKnLBKzL12zLxK.L1hML12eLxKqL1-eL1h.LxKBLBonL1h5LxK.LBKzL1KMLxKqL1-eLB-2LxK-LB.eL1h5LxK-L12qL1K2LxKqL1KnL1-qLxKML1K5L1het; SSOLoginState=1676338705; ALF=1678930705; MLOGIN=1; FPTOKEN=5yqpDeZsQU8rpeh4IKVaE6SovATC0x9iKSZYy6Oh9SapPaqIhBDUtO0Yv6QFMKaueUudDyf3d8XaiEjeyqgNFTIwyhb26eM9Jm+130xgW2T2EaPIC1Hbpf3EzDtKlh6yhgUJ19Xi/YZsxQgm3xBAtdGp9+3IKAt55Oz15bQNDyzFTBUeGrMKDkENOW6apAon2uf6e/Vtqq8d0ki5otCnXk0m2FuwHfx+CQ1CW4qHDOmm755HJwcKPyEPlk39kvMikv+p4R00vKGF42RE1YpIT+QZS/GzZJOkJahjvEwpZmygLcY4XFf1orLSW7VxYhZMaz3cixLpPWHXVIgAe1j/gnQk4ay3hH79eb2qtjI1p/NlIxH2D8/3LvVn9LqVR/FAC43HV/iqojfGekmpN/Nexw==|mZLHph4gOfT3DY7KAQa42YYesQgVzLNmTylNfxH7WGw=|10|cd366530eb76b0759d1dc9068feef2cb; M_WEIBOCN_PARAMS=oid=4869050930299810&lfid=4865715904972795&luicode=20000174; XSRF-TOKEN=85b0ab');

const runess = await page.evaluate(async () => {
  const result = await fetch('https://m.weibo.cn/feed/friends?', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8',
      'mweibo-pwa': '1',
      'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-requested-with': 'XMLHttpRequest',
      'x-xsrf-token': '85b0ab',
      // eslint-disable-next-line max-len
      cookie: '_ga=GA1.2.2070977570.1640746193; OUTFOX_SEARCH_USER_ID_NCOO=1431324063.1931155; __bid_n=183f9931fb0dd5e3ad4207; FPTOKEN=30$dtyE7VquLgawOZBPQ1XIqsdCJ6ZKfL5KhqUgxgil80AffVdOda/zywIJuCNSghnCecFr3aEvRIUTge2IWyxg5/SZ8P32Ocw1x4MwEkkaEVbJ64gbn2orhljM7osMCa/+VR3ur+Cw9JyKZ2EA7JE09c1FyID/5ze/Hmp614RIk/VWkgalcvA6UoyzhYQc2jHBQFz+EBLPSC18i5YuTb53rLwfap82Au614CESRZuRcuFgrIzRAHB2M0kavJtfuy89hiL+X5FPEYAszPTxdqPlqR3BKp+di/JsBo7hGTiip5FKBuTa3qJXJJ/0Dj7LEyergz9b/iIFGgAFrL2/kVWgAqaWkJrGrGa2KCKvGCi6QkogW58DnDGELxRLJ8BNXsTA|0sPcBU5/IvQuUNMP8fU80Dec0UDqgDGiUO6rHwjbRGs=|10|359ffd2d9a5b6e65b3cfcd2b951403b5; FEID=v10-b70b2d735a1389ed32df2f11b9668c444896a67f; __xaf_thstime__=1672900161046; __xaf_fpstarttimer__=1672900161408; __xaf_fptokentimer__=1672900161488; WEIBOCN_FROM=1110006030; BAIDU_SSP_lcr=https://login.sina.com.cn/; _T_WM=38559071378; SCF=Akt6J6V7kEvA6hPJ2P2Mtpr0KoSJ4f7kQ2qzjoXXPYftF8Jy63X-HKIB4-f-4L2-C40nK96pdyyN6kZ3FzQ5gTA.; SUB=_2A25O7pZBDeRhGeRK71MV8C7Ewj-IHXVqEDoJrDV6PUJbktANLRnxkW1NU1o8gRzQ7cXjNOGkEuZ8KfzhwtAcwTpM; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFBSyR4EMSbMPkfs4ydBs3Y5JpX5K-hUgL.FozXSh2Xeh5R1Ke2dJLoIN-LxKqL1hnL1K2LxKML1-2L1hBLxKnL1hBL1K2LxKnLBKzL12zLxK.L1hML12eLxKqL1-eL1h.LxKBLBonL1h5LxK.LBKzL1KMLxKqL1-eLB-2LxK-LB.eL1h5LxK-L12qL1K2LxKqL1KnL1-qLxKML1K5L1het; SSOLoginState=1676338705; ALF=1678930705; MLOGIN=1; FPTOKEN=5yqpDeZsQU8rpeh4IKVaE6SovATC0x9iKSZYy6Oh9SapPaqIhBDUtO0Yv6QFMKaueUudDyf3d8XaiEjeyqgNFTIwyhb26eM9Jm+130xgW2T2EaPIC1Hbpf3EzDtKlh6yhgUJ19Xi/YZsxQgm3xBAtdGp9+3IKAt55Oz15bQNDyzFTBUeGrMKDkENOW6apAon2uf6e/Vtqq8d0ki5otCnXk0m2FuwHfx+CQ1CW4qHDOmm755HJwcKPyEPlk39kvMikv+p4R00vKGF42RE1YpIT+QZS/GzZJOkJahjvEwpZmygLcY4XFf1orLSW7VxYhZMaz3cixLpPWHXVIgAe1j/gnQk4ay3hH79eb2qtjI1p/NlIxH2D8/3LvVn9LqVR/FAC43HV/iqojfGekmpN/Nexw==|mZLHph4gOfT3DY7KAQa42YYesQgVzLNmTylNfxH7WGw=|10|cd366530eb76b0759d1dc9068feef2cb; M_WEIBOCN_PARAMS=oid=4869050930299810&lfid=4865715904972795&luicode=20000174; XSRF-TOKEN=85b0ab',
    },
    referrer: 'https://m.weibo.cn',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.json());

  console.log(result);
  return result;
});
console.log(runess);

// await browser.close();
