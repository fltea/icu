/**
 * @description 異常數據處理
 */
import { ErrorModel } from '../model/ResModel.js';
import { errorInfo, timeoutInfo, forignInfo } from '../model/ErrorInfos.js';
import { setLog } from '../utils/files.js';

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    let info = errorInfo;
    // console.log(error);
    // console.log(error.name); // ReferenceError
    console.log('catchError', error.message); // lalala is not defined
    console.log(error.stack);
    const message = error.message.toLowerCase();
    if (message.includes('timeout')) {
      info = timeoutInfo;
    }
    if (message.includes('foreign key')) {
      info = forignInfo;
    }
    setLog('error', error);
    ctx.body = new ErrorModel(info);
  }
};

export default catchError;
