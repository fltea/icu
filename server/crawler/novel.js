import hparser from 'node-html-parser';
import request from '../utils/request.js';
import { headers, getAttrs, getText, getList } from '../utils/crawler.js';

export async function novelContent({ url, encode, title, author, content, lists, detailurl, listSort, multlist }) {
  const html = await request({
    url,
    header: headers({
      encode,
    }),
    method: 'GET',
  });
  const result = {
    url,
  };

  const root = hparser.parse(html);
  getAttrs(root, {
    title,
    author,
    multlist: [multlist, 'href'],
  }, result);

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
  return result;
}

export async function novelChapter({ url, encode, name, detail, detailex, arange, multpage }) {
  const html = await request({
    url,
    header: headers({
      encode,
    }),
    method: 'GET',
  });
  const result = {
    url,
  };

  const root = hparser.parse(html);
  let details = root.querySelector(detail);

  const dexs = details.querySelectorAll(detailex);
  dexs.forEach((v) => {
    v.remove();
  });

  details = details.innerHTML;
  details = details.replace(/&nbsp;/g, '');
  details = details.replace(/\r?\n?\s+?/g, '');
  details = details.replace(/<.+?>+/g, '{BR}');
  details = details.split('{BR}').filter((v) => !!v);

  if (arange && Array.isArray(arange)) {
    details = details.slice(...arange);
  }

  const title = name.replace(/\s+/, '');
  details = details.filter((v) => title !== v);

  // details = `\n${name}\n${details.join("\n")}`;
  result.detail = details.join('\n');

  if (multpage) {
    // 内容多页
    const nextpage = root.querySelector(multpage);
    result.multpage = nextpage.getAttribute('href');
  }
  return result;
}
