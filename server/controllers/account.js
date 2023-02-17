import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  accountInfo,
  accountList,
  accountAdd,
  accountUpdate,
  accountDelete,
  accountBulk,
  accountTie,
  accountTieUpdate,
} from '../services/account.js';

/**
 * 獲取單個數據
 */
export async function getAccount(id) {
  try {
    const result = await accountInfo(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getAccounts({ name, nickName, platform, phone, email, verify, beginDate, endDate, page, limit }) {
  try {
    const result = await accountList({ name, nickName, platform, phone, email, verify, beginDate, endDate, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createAccount({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  try {
    const result = await accountAdd({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark });
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
export async function createAccounts(list) {
  try {
    if (Array.isArray(list)) {
      const result = await accountBulk(list);
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
export async function modifyAccount({ id, name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await accountUpdate({ id, name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark });
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
export async function deleteAccount(id) {
  try {
    const result = await accountDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 新增數據
 */
export async function tieAccount({ tied, account, tieDate, untieDate, remark }) {
  try {
    const result = await accountTie({ tied, account, tieDate, untieDate, remark });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改數據
 */
export async function modifyTieAccount({ id, tieDate, untieDate, remark }) {
  try {
    const result = await accountTieUpdate({ id, tieDate, untieDate, remark });
    if (result) {
      return new SuccessModel(result);
    }

    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}
