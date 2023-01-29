import { addInfo, delInfo, updateInfo, schemaFileInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  videoInfo,
  videoList,
  videoAdd,
  videoUpdate,
  videoDelete,
  videoBulk,
} from '../services/video.js';

/**
 * 獲取單個數據
 */
export async function getVideo(id) {
  try {
    if (id) {
      const result = await videoInfo(id);
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getVideos({ title, creator, remark, page, limit }) {
  try {
    const result = await videoList({ title, creator, remark, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createVideo({ title, text, url, link, creator, blog, remark }) {
  try {
    const result = await videoAdd({ url, title, text, link, creator, blog, remark });
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
export async function createVideos(list) {
  try {
    if (Array.isArray(list)) {
      const result = await videoBulk(list);
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
export async function modifyVideo({ id, title, text, link, creator, blog, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await videoUpdate({ id, title, text, link, creator, blog, remark });
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
export async function deleteVideo(id) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await videoDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
