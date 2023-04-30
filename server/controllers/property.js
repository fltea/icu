import { addInfo, updateInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';

import {
  propertyInfo,
  propertys,
  newProperty,
  changeProperty,
} from '../services/property.js';

/**
 * 獲取單個數據
 */
export async function getProperty(id) {
  const result = await propertyInfo(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(notExistInfo);
}

/**
 * 獲取列表
 */
export async function getPropertys({ name, page, limit }) {
  const result = await propertys({ name, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setProperty({ name, type, code, beginDate, endDate, scale, price, inDate, outDate, count, amount, content, remark, media }) {
  const property = { name, type, code, beginDate, endDate, scale, price, inDate, outDate, count, amount, content, remark, media };
  const result = await newProperty(property);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}

/**
 * 修改數據
 */
export async function modProperty({ id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark, media }) {
  const property = { id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark, media };
  const result = await changeProperty(property);
  if (result) {
    return new SuccessModel(result);
  }

  return new ErrorModel(updateInfo);
}
