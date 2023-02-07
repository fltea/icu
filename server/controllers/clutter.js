import { addInfo, delInfo, isExistInfo, updateInfo, schemaFileInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  clutterInfo,
  clutterList,
  clutterAdd,
  clutterUpdate,
  clutterDelete,
  clutterBulk,
} from '../services/clutter.js';

/**
 * 獲取單個數據
 */
export async function getClutter({ id, type, phrase }) {
  try {
    if (id || (type && phrase)) {
      const result = await clutterInfo({ id, type, phrase });
      return new SuccessModel(result);
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getClutters({ type, page, limit }) {
  try {
    const result = await clutterList({ type, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createClutter({ type, content, phrase }) {
  try {
    let result = await clutterInfo({ type, phrase });
    if (result) {
      return new ErrorModel(isExistInfo);
    }

    const clutter = { type, content, phrase };
    result = await clutterAdd(clutter);
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
export async function createClutters(list) {
  try {
    if (Array.isArray(list)) {
      const result = await clutterBulk(list);
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
export async function modifyClutter({ id, type, content, phrase }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const clutter = { id, type, content, phrase };
    const result = await clutterUpdate(clutter);
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
export async function deleteClutter(id) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await clutterDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
