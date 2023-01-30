import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  meansInfo,
  meansList,
  meansAdd,
  meansUpdate,
  meansDelete,
  meansBulk,
} from '../services/means.js';

/**
 * 獲取單個數據
 */
export async function getMeans(id) {
  try {
    if (id) {
      const result = await meansInfo(id);
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
export async function getMeanss({ title, tag, author, content, translator, platform, publishDate, page, limit }) {
  try {
    const result = await meansList({ title, tag, author, content, translator, platform, publishDate, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createMeans({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }) {
  try {
    const means = { name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark };
    const result = await meansAdd(means);
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
export async function createMeanss(list) {
  try {
    if (Array.isArray(list)) {
      const result = await meansBulk(list);
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
export async function modifyMeans({ id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const means = { id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark };
    const result = await meansUpdate(means);
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
export async function deleteMeans(id) {
  try {
    const result = await meansDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
