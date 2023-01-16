const infos = {
  notExistInfo: {
    code: 404,
    message:"数据不存在"
  },
  isExistInfo: {
    code: 1000,
    message:"数据已存在"
  },
  addInfo: {
    code: 1001,
    message:"新增失败"
  },
  updateInfo: {
    code: 1002,
    message:"更新失败"
  },
  delInfo: {
    code: 1003,
    message:"删除失败"
  },
  jsonSchemaFileInfo:{
    code: 999,
    message:"格式校验失败"
  },
  uploadFileSizeFailInfo: {
    errno: 10001,
    message: "上传文件尺寸过大"
  },
  fetchInfo: {
    errno: 10011,
    message: "返回數據错误"
  },
}

module.exports = infos;