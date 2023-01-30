import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  flowInfo,
  flowList,
  flowAdd,
  flowUpdate,
  flowDelete,
  flowBulk,
} from '../services/flow.js';

/**
 * 獲取單個數據
 */
export async function getFlow(id) {
  try {
    if (id) {
      const result = await flowInfo(id);
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
export async function getFlows({ type, tag, means, inAccount, outAccount, createTime, page, limit }) {
  try {
    const result = await flowList({ type, tag, means, inAccount, outAccount, createTime, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createFlow({ type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark }) {
  try {
    const flow = { type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark };
    const result = await flowAdd(flow);
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
export async function createFlows(list) {
  try {
    if (Array.isArray(list)) {
      const result = await flowBulk(list);
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
export async function modifyFlow({ id, type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const flow = { id, type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark };
    const result = await flowUpdate(flow);
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
export async function deleteFlow(id) {
  try {
    const result = await flowDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
