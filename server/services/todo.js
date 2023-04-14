import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Todo } = models;
/**
 * 根據ID獲取todo
 * @param {number} id ID
 */
export async function todoInfo(id) {
  const where = {
    id,
  };

  const result = await Todo.findOne({
    where,
    raw: true,
  });

  return result;
}

export async function todos({ title, content, beginDate, deadline, completeDate, discarded, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};

  if (title) {
    where.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (content) {
    where.content = {
      [Op.like]: `%${content}%`,
    };
  }
  if (beginDate) {
    where.beginDate = beginDate;
  }
  if (deadline) {
    where.deadline = deadline;
  }
  if (discarded) {
    where.discarded = discarded;
  }
  if (completeDate) {
    where.completeDate = {
      [Op.lte]: completeDate,
    };
  }
  const search = {
    where,
    raw: true,
  };
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Todo.findAndCountAll(search);

  const data = {
    count: result.count,
    list: result.rows,
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }
  return data;
}
async function addTodo({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded }) {
  let result = await Todo.create({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded });
  if (result) {
    result = result.dataValues;
  }
  return result;
}
export async function newTodo(item) {
  const result = await rollBack(addTodo, item);
  return result;
}

export async function changeTodo({ id, content, beginDate, order, deadline, completeDate, discarded, disuseTime }) {
  const where = {
    id,
  };
  const todo = {};
  if (order) {
    todo.order = order;
  }
  if (content) {
    todo.content = content;
  }
  if (beginDate) {
    todo.beginDate = beginDate;
  }
  if (deadline) {
    todo.deadline = deadline;
  }
  if (completeDate) {
    todo.completeDate = completeDate;
  }
  if (discarded) {
    todo.discarded = discarded;
    todo.disuseTime = disuseTime || new Date();
  }
  const result = await Todo.update(todo, {
    where,
  });
  return result[0] > 0;
}

async function delTodo(id) {
  const result = await Todo.destroy({
    where: {
      id,
    },
  });
  return result > 0;
}
export async function deleteTodo(id) {
  const result = await rollBack(delTodo, id);
  return result;
}
