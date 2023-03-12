/**
 * @description 異常數據處理
 */
import { ErrorModel } from '../model/ResModel.js';
import { errorInfo, timeoutInfo } from '../model/ErrorInfos.js';

async function catchError(error) {
  let info = errorInfo;
  console.log(error);
  // console.log(error.name); // ReferenceError
  // console.log(error.message); // lalala is not defined
  // console.log(error.stack);
  if (error.message.includes('timeout')) {
    info = timeoutInfo;
  }
  return new ErrorModel(info);
}

export default catchError;
