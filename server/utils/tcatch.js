/**
 * @description 異常數據處理
 */
import { ErrorModel } from '../model/ResModel.js';
import { errorInfo } from '../model/ErrorInfos.js';

async function catchError(error) {
  console.log(error);
  return new ErrorModel(errorInfo);
}

export default catchError;
