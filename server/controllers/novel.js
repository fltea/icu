import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  novelInfo,
  novelList,
  novelAdd,
  novelUpdate,
  novelDelete,
  novelBulk,
} from '../services/novel.js';

/**
 * 獲取單個數據
 */
export async function getNovel(id) {
  try {
    if (id) {
      const result = await novelInfo(id);
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
export async function getNovels({ title, noveler, page, limit }) {
  try {
    const result = await novelList({ title, noveler, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createNovel({ url, title, content, noveler }) {
  try {
    const novel = { url, title, content, noveler };
    const keys = ['noveler'];
    keys.forEach((v) => {
      if (!novel[v]) {
        delete novel[v];
      }
    });
    const result = await novelAdd(novel);
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
export async function modifyNovel({ id, url, title, content, noveler }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const novel = { id, url, title, content, noveler };
    const keys = ['noveler'];
    keys.forEach((v) => {
      if (!novel[v]) {
        delete novel[v];
      }
    });
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
