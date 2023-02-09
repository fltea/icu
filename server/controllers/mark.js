import { addInfo, delInfo, updateInfo, isExistInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { reqiureFile } from '../utils/files.js';

import {
  markInfo,
  markList,
  markAdd,
  markUpdate,
  markDelete,
  markBulk,
} from '../services/mark.js';

/**
 * 獲取單個數據
 */
export async function getMark({ id, url }) {
  try {
    if (id || url) {
      const result = await markInfo({ id, url });
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getMarks({ url, title, page, limit }) {
  try {
    const result = await markList({ url, title, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createMark({ url, title, description, icons }) {
  try {
    let result = await markInfo({ url });
    if (result) {
      return new ErrorModel(isExistInfo);
    }
    result = await markAdd({ url, title, description, icons });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建多個數據
 */
export async function createMarks({ file }) {
  try {
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

    const result = await markBulk(links);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改數據
 */
export async function modifyMark({ id, url, title, description, icons }) {
  try {
    if (!id) {
      return new ErrorModel(notExistInfo);
    }
    const result = await markUpdate({ id, url, title, description, icons });
    if (result) {
      return new SuccessModel(result);
    }

    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 刪除數據
 */
export async function deleteMark(id) {
  try {
    const result = await markDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 導出數據
 */
export async function exportMarks() {
  try {
    let { list } = await markList({ limit: null });
    console.log('result', list.length);
    const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>`;
    list = list.map((v) => `<p><a href="${v.url}" icons="${v.icons}">${v.title}</a></p>`);
    console.log('list', list.length);
    return header + list.join('');
  } catch (error) {
    return catchError(error);
  }
}
