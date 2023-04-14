import { addInfo, delInfo, updateInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';

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
  const result = await todoInfo(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(notExistInfo);
}

/**
 * 獲取列表
 */
export async function getTodos({ title, content, beginDate, deadline, completeDate, discarded, page, limit }) {
  const result = await todos({ title, content, beginDate, deadline, completeDate, discarded, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setTodo({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded }) {
  const todo = { title, content, order, beginDate, deadline, completeDate, disuseTime, discarded };

  const result = await newTodo(todo);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}

/**
 * 修改數據
 */
export async function modTodo({ id, content, beginDate, order, deadline, completeDate, discarded, disuseTime, type }) {
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
}

/**
 * 刪除數據
 */
export async function delTodo(id) {
  const result = await deleteTodo(id);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(delInfo);
}
