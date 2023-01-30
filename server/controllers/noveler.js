import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  novelerInfo,
  novelerList,
  novelerAdd,
  novelerUpdate,
  novelerDelete,
  novelerBulk,
} from '../services/noveler.js';

/**
 * 獲取單個數據
 */
export async function getNoveler(id) {
  try {
    if (id) {
      const result = await novelerInfo(id);
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
export async function getNovelers({ page, limit }) {
  try {
    const result = await novelerList({ page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createNoveler({ domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode }) {
  try {
    const noveler = { domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode };
    const result = await novelerAdd(noveler);
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
export async function createNovelers(list) {
  try {
    if (Array.isArray(list)) {
      const result = await novelerBulk(list);
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
export async function modifyNoveler({ id, domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const noveler = { id, domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode };
    const result = await novelerUpdate(noveler);
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
export async function deleteNoveler(id) {
  try {
    const result = await novelerDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
