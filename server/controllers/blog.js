import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  blogInfo,
  blogList,
  blogAdd,
  blogUpdate,
  blogDelete,
  blogBulk,
} from '../services/blog.js';

/**
 * 獲取單個數據
 */
export async function getBlog(id) {
  try {
    if (id) {
      const result = await blogInfo(id);
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
export async function getBlogs({ text, creator, page, limit }) {
  try {
    const result = await blogList({ text, creator, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createBlog({ text, creator, link,
  source, remark }) {
  try {
    const blog = { text,
      creator,
      link,
      source,
      remark };
    if (!blog.source) {
      delete blog.source;
    }
    const result = await blogAdd(blog);
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
export async function createBlogs(list) {
  try {
    if (Array.isArray(list)) {
      const result = await blogBulk(list);
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
export async function modifyBlog({ id, text, creator, link,
  source, remark }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const result = await blogUpdate({ id,
      text,
      creator,
      link,
      source,
      remark });
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
export async function deleteBlog(id) {
  try {
    const result = await blogDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
