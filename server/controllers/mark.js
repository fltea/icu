import { addInfo, delInfo, updateInfo, isExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import { reqiureFile } from '../utils/files.js';

import {
  markInfo,
  marks,
  newMark,
  changeMark,
  deleteMark,
  bulkMark,
} from '../services/mark.js';

/**
 * 獲取列表
 */
export async function getMark({ url, title, page, limit }) {
  const result = await marks({ url, title, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setMark({ url, title, description, icons }) {
  let result = await markInfo({ url });
  if (result) {
    return new ErrorModel(isExistInfo);
  }
  result = await newMark({ url, title, description, icons });
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}

/**
 * 創建多個數據
 */
export async function setMarks({ file }) {
  let data = reqiureFile(file.filepath);
  data = Buffer.from(data).toString();
  let links = data.match(/<a\s.*?<\/a>/ig);
  links = links.map((v) => v.split(/"|>/));
  links = links.map((v) => {
    const item = {};
    item.url = v.find((s) => s.includes('http')) || '';
    item.title = v.find((s) => s.includes('</')) || '';
    item.title = item.title.split('<').shift();
    item.icons = v.find((s) => s.includes('base64')) || '';
    return item;
  });

  const result = await bulkMark(links);
  return new SuccessModel(result);
}

/**
 * 修改數據
 */
export async function modMark({ id, url, title, description, icons }) {
  const result = await changeMark({ id, url, title, description, icons });
  if (result) {
    return new SuccessModel(result);
  }

  return new ErrorModel(updateInfo);
}

/**
 * 刪除數據
 */
export async function delMark(id) {
  const result = await deleteMark(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(delInfo);
}

/**
 * 導出數據
 */
export async function exportMarks() {
  let { list } = await marks({ page: null });
  console.log('result', list.length);
  const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>`;
  list = list.map((v) => `<p><a href="${v.url}" icons="${v.icons}">${v.title}</a></p>`);
  console.log('list', list.length);
  return header + list.join('');
}
