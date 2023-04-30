import { addInfo, delInfo, updateInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';

import {
  statisticInfo,
  statistics,
  newStatistic,
  changeStatistic,
  deleteStatistic,
} from '../services/statistic.js';

/**
 * 獲取單個數據
 */
export async function getStatistic(id) {
  const result = await statisticInfo(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(notExistInfo);
}

/**
 * 獲取列表
 */
export async function getStatistics({ type, page, limit }) {
  const result = await statistics({ type, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setStatistic({ type, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  const stats = { type, date, income, expense, found, stock, deposit, bank, cash, remark };
  const result = await newStatistic(stats);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}

/**
 * 修改數據
 */
export async function modStatistic({ id, type, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  const stats = { id, type, date, income, expense, found, stock, deposit, bank, cash, remark };
  const result = await changeStatistic(stats);
  if (result) {
    return new SuccessModel(result);
  }

  return new ErrorModel(updateInfo);
}

/**
 * 刪除數據
 */
export async function delStatistic(id) {
  const result = await deleteStatistic(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(delInfo);
}
