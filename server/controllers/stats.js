import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  statsInfo,
  statsList,
  statsAdd,
  statsUpdate,
  statsDelete,
  statsBulk,
} from '../services/stats.js';

/**
 * 獲取單個數據
 */
export async function getStats(id) {
  try {
    if (id) {
      const result = await statsInfo(id);
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
export async function getStatss({ type, page, limit }) {
  try {
    const result = await statsList({ type, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createStats({ type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  try {
    const stats = { type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark };
    const result = await statsAdd(stats);
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
export async function createStatss(list) {
  try {
    if (Array.isArray(list)) {
      const result = await statsBulk(list);
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
export async function modifyStats({ id, type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const stats = { id, type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark };
    const result = await statsUpdate(stats);
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
export async function deleteStats(id) {
  try {
    const result = await statsDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
