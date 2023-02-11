import { addInfo, delInfo, updateInfo, schemaFileInfo, isExistInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { appendFile, reqiureFile } from '../utils/files.js';
import hash from '../utils/crypto.js';
import { TEMP_DIR } from '../conf/constant.js';

import {
  novelInfo,
  novelList,
  novelAdd,
  novelUpdate,
  novelDelete,
  novelBulk,
  novelContent,
  novelChapter,
} from '../services/novel.js';
import {
  chapterBulk,
  chapterInfo,
  chapterList,
  chapterAdd,
  chapterUpdate,
} from '../services/chapter.js';

/**
 * 如果存在list则保存到数据库
 */
function url2chapters(id, url) {
  const listId = hash(url);
  const listData = reqiureFile(`${TEMP_DIR}/${listId}`);
  const list = JSON.parse(listData).map((v) => ({
    url: v.url,
    title: v.name,
    content: '',
    author: '',
    novel: id,
  }));
  chapterBulk(list);
}

/**
 * 獲取單個數據
 */
export async function getNovel(id) {
  try {
    if (id) {
      const result = await novelInfo({ id });
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
export async function getNovels({ title, author, finish, content, page, limit }) {
  try {
    const novel = { title, author, finish, content, page, limit };
    if (`${novel.finish}`) {
      novel.finish = !!novel.finish;
    }
    const result = await novelList({ title, author, finish, content, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createNovel({ url, title, content, clutter, author, finish, origin, loaded }) {
  try {
    let result = await novelInfo({ url });
    if (result) {
      return new ErrorModel(isExistInfo);
    }
    const novel = { url, title, content, clutter, author, finish, origin, loaded };
    result = await novelAdd(novel);
    if (result) {
      url2chapters(result.id, url);
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
export async function createNovels(list) {
  try {
    if (Array.isArray(list)) {
      const result = await novelBulk(list);
      return new SuccessModel(result);
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改數據
 */
export async function modifyNovel({ id, url, title, content, clutter, author, finish, origin, loaded }) {
  try {
    const novel = { id, url, title, content, clutter, author, finish, origin, loaded };
    const result = await novelUpdate(novel);
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
export async function deleteNovel(id) {
  try {
    const result = await novelDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}

function getPage(url, home) {
  const isHome = url === home;
  if (!isHome) {
    return url;
  }
  return null;
}

/**
 * 文章目录内容
 */
export async function contentNovel({ url, encode, title, author, content, lists, detailurl, listSort, multlist, nolist }) {
  try {
    const result = await novelContent({ url, encode, title, author, content, lists, detailurl, listSort, multlist });
    let nextPage;
    if (result.multlist) {
      nextPage = getPage(result.multlist, url);
    }
    while (nextPage) {
      const nextResult = await novelContent({ url: nextPage, encode, title, author, content, lists, detailurl, listSort, multlist });
      if (nextResult.multlist) {
        nextPage = getPage(nextResult.multlist, url);
      }
      const nlist = nextResult.list;
      if (Array.isArray(nlist) && nlist.length) {
        result.list.push(...nlist);
      }
    }

    // 暂存list在服务器
    const tempId = hash(url);
    appendFile(`${TEMP_DIR}/${tempId}`, JSON.stringify(result.list), { flag: 'w' });

    if (nolist) {
      delete result.list;
    }

    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 文章章节
 */
export async function chapterNovel({ url, encode, name, detail, detailex, dstart, dend, multpage }) {
  try {
    let arange;
    if (dstart || dend) {
      arange = [+dstart, +dend];
    }
    const result = await novelChapter({ url, encode, name, detail, detailex, arange, multpage });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 批量保存章节
 */
export async function listChapter({ listId, novel }) {
  try {
    let list;
    if (listId) {
      list = reqiureFile(`${TEMP_DIR}/${listId}`);
      list = JSON.parse(list).map((v) => ({
        url: v.url,
        title: v.name,
        novel,
        content: '',
        author: '',
      }));
      list = await chapterBulk(list);
      // console.log(list);
      // list = list.filter((v) => !!v.id);
      return list;
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 新增章节
 */
export async function addChapter({ url, title, novel, content, author }) {
  try {
    let result = await chapterInfo({ url });
    if (result) {
      return new ErrorModel(isExistInfo);
    }
    result = await chapterAdd({ url, title, novel, content, author });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改章节
 */
export async function modifyChapter({ id, url, title, novel, content, author }) {
  try {
    const result = await chapterUpdate({ id, url, title, novel, content, author });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 根据 novelId 获取章节列表
 */
export async function novelChapters({ novel, page, limit }) {
  try {
    const result = await chapterList({ novel, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 根据 Id 获取章节内容
 */
export async function contentChapter({ id, url }) {
  try {
    const result = await chapterInfo({ id, url });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}
