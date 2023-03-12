import hparser from 'node-html-parser';
import request from '../utils/request.js';
import prequest from '../puppeteer/request.js';
import { headers, getAttrs, getText, getList, getTextContent } from '../utils/crawler.js';

export async function novelContent({ url, encode, title, author, content, lists, detailurl, listSort, multlist, puppeteer }) {
  let html;
  if (puppeteer) {
    html = await prequest({
      url,
      selector: lists,
    });
  } else {
    html = await request({
      url,
      header: headers(),
      encode,
      method: 'GET',
      timeout: 10000,
    });
  }
  const result = {
    url,
  };

  const root = hparser.parse(html);
  const attrs = {
    title,
    author,
  };
  if (multlist) {
    attrs.multlist = [multlist, 'href'];
  }
  getAttrs(root, attrs, result);

  if (content) {
    // 內容簡介
    const contents = root.querySelector(content);
    result.content = getText(contents, 'innerHTML');
  }

  // 目錄
  let list = root.querySelectorAll(lists);
  list = getList(list, detailurl);
  if (listSort) {
    list.sort((a, b) => parseInt(a.url, 10) - parseInt(b.url, 10));
  }
  result.list = list;

  // 标题
  if (result.title) {
    result.title = result.title.replace('首页>', '');
  }
  return result;
}

export async function novelChapter({ url, encode, title, detail, detailex, arange, multpage, puppeteer }) {
  let html;
  if (puppeteer) {
    html = await prequest({
      url,
      selector: detail,
    });
  } else {
    html = await request({
      url,
      header: headers(),
      encode,
      method: 'GET',
      timeout: 10000,
    });
  }
  const result = {
    url,
  };

  const root = hparser.parse(html);
  const details = root.querySelector(detail);

  const dexs = details.querySelectorAll(detailex);
  dexs.forEach((v) => {
    v.remove();
  });

  result.detail = getTextContent(details, title, arange);

  if (multpage) {
    // 内容多页
    const nextpage = root.querySelector(multpage);
    result.multpage = nextpage.getAttribute('href');
  }
  return result;
}
