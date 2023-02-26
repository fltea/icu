import { UserAgent } from '../conf/constant.js';

export function getHeader(cookie, referer) {
  const header = {
    'User-Agent': UserAgent,
  };
  if (cookie) {
    header.cookie = cookie;
  }

  if (referer) {
    header.referer = referer;
  }
  return header;
}

export function getData(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

/**
 * HTMLElement#text
    Get unescaped text value of current node and its children. Like innerText. (slow for the first time)

    HTMLElement#rawText
    Get escaped (as-is) text value of current node and its children. May have &amp; in it. (fast)
 */
export function getText(dom, key = 'text') {
  try {
    // return dom.rawText;
    let text = dom[key];
    text = text.replace(/\r?\n?/g, '');
    text = text.replace(/\s{2,}?/g, '');
    return text;
  } catch (error) {
    return '';
  }
}

export function getAttr(dom, attibute) {
  try {
    // return dom.rawText;
    return dom.getAttribute(attibute);
  } catch (error) {
    return '';
  }
}

export function getAttrs(root, attibutes, result) {
  const keys = Object.keys(attibutes || {});
  keys.forEach((key) => {
    let value;
    let selector = attibutes[key];
    if (Array.isArray(selector)) {
      value = selector.slice(-1).pop();
      selector = selector.slice().shift();
    }
    const dom = root.querySelector(selector);
    if (dom) {
      if (value) {
        value = getAttr(dom, value);
      } else {
        value = getText(dom);
      }
      result[key] = value;
    }
  });
}

/**
 * 获取列表
 */
export function getList(doms, preurl, listSort) {
  const list = doms.map((a) => {
    const url = a.getAttribute('href');
    const name = a.text;
    return {
      name,
      url: `${preurl || ''}${url}`,
    };
  });
  if (listSort) {
    // list.sort((a, b) => parseInt(a.url, 10) - parseInt(b.url, 10));
  }
  return list;
}

/**
 * 获取纯文本内容
 */
export function getTextContent(dom, title, arange) {
  try {
    let details = dom.innerHTML;
    details = details.replace(/&nbsp;/g, '');
    details = details.replace(/\r?\n?\s+?/g, '');
    details = details.replace(/<.+?>+/g, '{BR}');
    details = details.split('{BR}').filter((v) => !!v);

    if (arange && Array.isArray(arange)) {
      details = details.slice(...arange);
    }

    const name = title.replace(/\s+/, '');
    details = details.filter((v) => name !== v);

    return details.join('\n');
  } catch (error) {
    return '';
  }
}
