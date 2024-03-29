import { ErrorModel } from '../model/ResModel.js';
import { schemaFileInfo } from '../model/ErrorInfos.js';
/**
 * 生成 json schema 校验
 * @param {function} validateFn 验证函数
 * @returns
 */
function genValidator(model, validateFn) {
  async function validator(ctx, next) {
    // console.log('ctx.request.body ', ctx.request.body);
    let error;
    // 校验
    if (model === 'files') {
      const { files } = ctx.request;
      const list = Object.keys(files);
      if (!list.length) {
        error = '没有文件';
      }
    } else {
      const data = ctx.request.body;
      error = await validateFn(model, data);
    }
    if (error) {
      // 失败 报错
      console.log('validator', error);
      ctx.body = new ErrorModel(schemaFileInfo);
      return;
    }
    // 成功 继续
    await next();
  }
  return validator;
}

export default genValidator;
