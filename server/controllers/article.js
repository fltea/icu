import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  articleInfo,
  articleList,
  articleAdd,
  articleUpdate,
  articleDelete,
  articleBulk,
} from '../services/article.js';

/**
 * 獲取單個數據
 */
export async function getArticle(id) {
  try {
    if (id) {
      const result = await articleInfo(id);
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
export async function getArticles({ name, nickName, platform, phone, email, verify, beginDate, endDate, page, limit }) {
  try {
    const result = await articleList({ name, nickName, platform, phone, email, verify, beginDate, endDate, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createArticle({ title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source }) {
  try {
    const article = { title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source };
    const keys = ['todo', 'book', 'source'];
    keys.forEach((v) => {
      if (!article[v]) {
        delete article[v];
      }
    });
    const result = await articleAdd(article);
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
export async function createArticles(list) {
  try {
    if (Array.isArray(list)) {
      const result = await articleBulk(list);
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
export async function modifyArticle({ id, title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const article = { id, title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source };
    const keys = ['todo', 'book', 'source'];
    keys.forEach((v) => {
      if (!article[v]) {
        delete article[v];
      }
    });
    const result = await articleUpdate(article);
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
export async function deleteArticle(id) {
  try {
    const result = await articleDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
