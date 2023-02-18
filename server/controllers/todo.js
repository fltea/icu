import { addInfo, delInfo, updateInfo, schemaFileInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  todoInfo,
  todoList,
  todoAdd,
  todoUpdate,
  todoDelete,
  todoBulk,
} from '../services/todo.js';

/**
 * 獲取單個數據
 */
export async function getTodo(id) {
  try {
    const result = await todoInfo(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getTodos({ title, content, beginDate, deadline, completeDate, discarded, page, limit }) {
  try {
    const result = await todoList({ title, content, beginDate, deadline, completeDate, discarded, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function createTodo({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded }) {
  try {
    const todo = { title, content, order, beginDate, deadline, completeDate, disuseTime, discarded };
    Object.keys(todo).forEach((key) => {
      if (!todo[key]) {
        // delete todo[key];
        // todo[key] = null;
      }
    });
    const result = await todoAdd(todo);
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
export async function createTodos(list) {
  try {
    if (Array.isArray(list)) {
      const result = await todoBulk(list);
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
export async function modifyTodo({ id, content, beginDate, order, deadline, completeDate, discarded, disuseTime }) {
  try {
    const todo = { id, content, beginDate, order, deadline, completeDate, discarded, disuseTime };
    const result = await todoUpdate(todo);
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
export async function deleteTodo(id) {
  try {
    const result = await todoDelete(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
