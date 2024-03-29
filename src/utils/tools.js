export function formatTime(time) {
  let str = new Date(time).toLocaleString('en-US', { hour12: false });
  str = str.split(',');
  let string = str[0].split('/');
  string = `${string.pop()}年${string.join('月')}日`;
  return `${string} ${str.pop()}`;
}

/**
 *
 * @param {number} time  睡眠时间
 * @returns Promise
 */
export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function deepCopy(target) {
  // null, undefined
  let result = null;
  if (target === undefined || target === null) result = target;
  // 對象
  if (typeof target === 'object') result = JSON.parse(JSON.stringify(target));
  // 其他
  if (typeof target !== 'object') result = target;
  return result;
}

/**
 * 获取 n - m 之间的随机整数
 * @param {number} n 开始值
 * @param {number} m 结束值
 */
export function randInt(n = 1, m = 10) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

/**
 * 日期格式化
 * @param {string|date|number} date
 * @param {string} format
 * @returns string
 */
export function formatDate(date = new Date(), format = 'YYYY-mm-dd HH:MM:SS') {
  date = new Date(date);
  if (isNaN(+date)) {
    return date;
  }
  const options = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  };
  let ret;
  for (const k in options) {
    ret = new RegExp(`(${k})`).exec(format);
    if (ret) {
      format = format.replace(
        ret[1],
        ret[1].length === 1
          ? options[k]
          : options[k].padStart(ret[1].length, '0'),
      );
    }
  }
  return format;
}

export function urlStringify(data) {
  if (!data) {
    return '';
  }
  const arrs = Object.keys(data).map((key) => `${key}=${data[key]}`);

  return arrs.join('&');
}

export function getComName(name) {
  let strs = name.split('-');
  strs = strs.map((v) => {
    const IndexC = v.charAt(0);
    return IndexC.toUpperCase() + v.replace(IndexC, '');
  });
  return strs.join('');
}

export function getDomain(url) {
  let domain;
  if (url && url.includes('http')) {
    const vals = url.split('://');
    const links = vals.pop().split('/').shift();
    vals.push(links);
    domain = vals.join('://');
  }
  return domain;
}

export function getOffsetTop(dom) {
  let cdom = dom;
  let top = cdom.offsetTop;
  let nnode = cdom.offsetParent;
  while (nnode) {
    cdom = nnode;
    top += cdom.offsetTop;
    nnode = cdom.offsetParent;
  }
  return top;
}
