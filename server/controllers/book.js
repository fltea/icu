import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  bookInfo,
  bookList,
  bookAdd,
  bookUpdate,
  bookDelete,
  bookBulk,
} from '../services/book.js';

/**
 * 獲取單個數據
 */
export async function getBook(id) {
  try {
    if (id) {
      const result = await bookInfo(id);
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
export async function getBooks({ title, tag, author, ISBN, translator, series, publishDate, page, limit }) {
  try {
    const result = await bookList({ title, tag, author, ISBN, translator, series, publishDate, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createBook({ title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark }) {
  try {
    const book = { title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark };
    const result = await bookAdd(book);
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
export async function createBooks(list) {
  try {
    if (Array.isArray(list)) {
      const result = await bookBulk(list);
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
export async function modifyBook({ id, title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const book = { id, title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark };
    const keys = ['todo', 'book', 'source'];
    keys.forEach((v) => {
      if (!book[v]) {
        delete book[v];
      }
    });
    const result = await bookUpdate(book);
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
export async function deleteBook(id) {
  try {
    const result = await bookDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
