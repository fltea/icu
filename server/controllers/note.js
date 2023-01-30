import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  noteInfo,
  noteList,
  noteAdd,
  noteUpdate,
  noteDelete,
  noteBulk,
} from '../services/note.js';

/**
 * 獲取單個數據
 */
export async function getNote(id) {
  try {
    if (id) {
      const result = await noteInfo(id);
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
export async function getNotes({ source, article, content, page, limit }) {
  try {
    const result = await noteList({ source, article, content, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createNote({ content, position, source, article }) {
  try {
    const note = { content, position, source, article };
    const keys = ['article'];
    keys.forEach((v) => {
      if (!note[v]) {
        delete note[v];
      }
    });
    const result = await noteAdd(note);
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
export async function createNotes(list) {
  try {
    if (Array.isArray(list)) {
      const result = await noteBulk(list);
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
export async function modifyNote({ id, content, position, source, article }) {
  try {
    if (!id) {
      return new ErrorModel(schemaFileInfo);
    }
    const note = { id, content, position, source, article };
    const keys = ['article'];
    keys.forEach((v) => {
      if (!note[v]) {
        delete note[v];
      }
    });
    const result = await noteUpdate(note);
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
export async function deleteNote(id) {
  try {
    const result = await noteDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
