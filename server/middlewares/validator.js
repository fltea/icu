const { ErrorModel } = require('../model/ResModel');
const { schemaFileInfo } = require('../model/ErrorInfos');
/**
 * 生成 json schema 校验
 * @param {function} validateFn 验证函数
 * @returns
 */
function genValidator(model, validateFn) {
  async function validator(ctx, next) {
    // console.log('ctx.request.body ', ctx.request.body);
    // 校验
    const data = ctx.request.body;
    const error = validateFn(model, data);
    if (error) {
      // 失败 报错
      ctx.body = new ErrorModel(schemaFileInfo);
      return;
    }
    // 成功 继续
    await next();
  }
  return validator;
}

module.exports = {
  genValidator,
};
