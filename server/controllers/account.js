import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  accountInfo,
  accounts,
  newAccount,
  changeAccount,
  deleteAccount,
  accountTie,
  changeAccountTie,
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
    const result = await accounts({ name, nickName, platform, phone, email, verify, beginDate, endDate, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function setAccount({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  try {
    const result = await newAccount({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark });
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
export async function modAccount({ id, name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await changeAccount({ id, name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark });
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
export async function delAccount(id) {
  try {
    const result = await deleteAccount(id);
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
export async function tieAccount({ tied, tiedName, account, accountName, tieDate, untieDate, remark }) {
  try {
    const result = await accountTie({ tied, tiedName, account, accountName, tieDate, untieDate, remark });
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
export async function modAccountTie({ id, tiedName, accountName, tieDate, untieDate, remark }) {
  try {
    const result = await changeAccountTie({ id, tiedName, accountName, tieDate, untieDate, remark });
    if (result) {
      return new SuccessModel(result);
    }

    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}
