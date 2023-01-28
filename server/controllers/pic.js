import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  picInfo,
  picList,
  picAdd,
  picUpdate,
  picDelete,
  picBulk,
} from '../services/pic.js';

/**
 * 獲取單個數據
 */
export async function getPic(url) {
  try {
    if (url) {
      const result = await picInfo(url);
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
export async function getPics({ creator, remark, page, limit }) {
  try {
    const result = await picList({ creator, remark, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 * { url, link, creator, text, remark }
 */
export async function createPic({ url, link, creator, text, remark }) {
  try {
    const result = await picAdd({ url, link, creator, text, remark });
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
export async function createPics(list) {
  try {
    if (Array.isArray(list)) {
      const result = await picBulk(list);
      return new SuccessModel(result);
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}
/**
 * 更新数据
 */
export async function modifyPic({ id, link, creator, text, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await picUpdate({ id, link, creator, text, remark });
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
export async function deletePic(id) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await picDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
