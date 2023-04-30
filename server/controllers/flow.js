import { addInfo, delInfo, updateInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';

import {
  flowInfo,
  flows,
  newFlow,
  changeFlow,
  deleteFlow,
} from '../services/flow.js';

/**
 * 獲取單個數據
 */
export async function getFlow(id) {
  if (id) {
    const result = await flowInfo(id);
    if (result) {
      return new SuccessModel(result);
    }
  }
  return new ErrorModel(notExistInfo);
}

/**
 * 獲取列表
 */
export async function getFlows({ type, tag, property, inAccount, outAccount, createTime, page, limit }) {
  const result = await flows({ type, tag, property, inAccount, outAccount, createTime, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setFlow({ type, createTime, fee, commission, amount, price, name, tag, property, inAccount, outAccount, tieRelation, remark }) {
  const flow = { type, createTime, fee, commission, amount, price, name, tag, property, inAccount, outAccount, tieRelation, remark };
  const result = await newFlow(flow);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}

/**
 * 修改數據
 */
export async function modFlow({ id, type, createTime, fee, commission, amount, price, name, tag, property, inAccount, outAccount, tieRelation, remark }) {
  const flow = { id, type, createTime, fee, commission, amount, price, name, tag, property, inAccount, outAccount, tieRelation, remark };
  const result = await changeFlow(flow);
  if (result) {
    return new SuccessModel(result);
  }

  return new ErrorModel(updateInfo);
}

/**
 * 刪除數據
 */
export async function delFlow(id) {
  const result = await deleteFlow(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(delInfo);
}
