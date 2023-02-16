import { addInfo, delInfo, updateInfo, schemaFileInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  mlogInfo,
  mlogList,
  mlogAdd,
  mlogUpdate,
  mlogDelete,
  mlogBulk,
} from '../services/mlog.js';

/**
 * 獲取單個數據
 */
export async function getMlog(id) {
  try {
    const result = await mlogInfo(id);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getMlogs({ text, creator, page, limit }) {
  try {
    const result = await mlogList({ text, creator, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createMlog({ text, creator, link,
  source, remark }) {
  try {
    const result = await mlogAdd({ text, creator, link, source, remark });
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
export async function createMlogs(list) {
  try {
    if (Array.isArray(list)) {
      const result = await mlogBulk(list);
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
export async function modifyMlog({ id, text, creator, link,
  source, remark }) {
  try {
    const result = await mlogUpdate({ id, text, creator, link, source, remark });
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
export async function deleteMlog(id) {
  try {
    const result = await mlogDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
