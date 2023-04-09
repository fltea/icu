import { addInfo, delInfo, updateInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  todoInfo,
  todos,
  newTodo,
  changeTodo,
  deleteTodo,
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
    const result = await todos({ title, content, beginDate, deadline, completeDate, discarded, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 創建數據
 */
export async function setTodo({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded }) {
  try {
    const todo = { title, content, order, beginDate, deadline, completeDate, disuseTime, discarded };

    const result = await newTodo(todo);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改數據
 */
export async function modTodo({ id, content, beginDate, order, deadline, completeDate, discarded, disuseTime, type }) {
  try {
    let todo;
    if (type) {
      todo = {
        id,
      };
      if (type === 'complete') {
        todo.completeDate = new Date();
      }
      if (type === 'discarded') {
        todo.discarded = true;
      }
    } else {
      todo = { id, content, beginDate, order, deadline, completeDate, discarded, disuseTime };
    }
    const result = await changeTodo(todo);
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
export async function delTodo(id) {
  try {
    const result = await deleteTodo(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
