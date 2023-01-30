import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  sourceInfo,
  sourceList,
  sourceAdd,
  sourceUpdate,
  sourceDelete,
  sourceBulk,
} from '../services/source.js';

/**
 * 獲取單個數據
 */
export async function getSource(id) {
  try {
    if (id) {
      const result = await sourceInfo(id);
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
export async function getSources({ basic, plaform, author, page, limit }) {
  try {
    const result = await sourceList({ basic, plaform, author, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createSource({ basic, basicId, plaform, link, author, authorLink, publishTime }) {
  try {
    const source = { basic, basicId, plaform, link, author, authorLink, publishTime };
    const result = await sourceAdd(source);
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
export async function createSources(list) {
  try {
    if (Array.isArray(list)) {
      const result = await sourceBulk(list);
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
export async function modifySource({ id, basic, basicId, plaform, link, author, authorLink, publishTime }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const source = { id, basic, basicId, plaform, link, author, authorLink, publishTime };
    const result = await sourceUpdate(source);
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
export async function deleteSource(id) {
  try {
    const result = await sourceDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
