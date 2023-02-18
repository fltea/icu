import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Todo } = models;
/**
 * 根據ID獲取todo
 * @param {number} id ID
 */
export async function todoInfo(id) {
  try {
    const where = {
      id,
    };

    const result = await Todo.findOne({
      where,
    });

    if (result) {
      return result.dataValues;
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function todoList({ title, content, beginDate, deadline, completeDate, discarded, page = 1, limit = PAGE_SIZE }) {
  try {
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
    };
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Todo.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    const data = {
      count: result.count,
      list,
    };
    if (page) {
      data.page = page;
      data.limit = limit;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function todoAdd({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded }) {
  try {
    const result = await Todo.create({ title, content, order, beginDate, deadline, completeDate, disuseTime, discarded });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function todoUpdate({ id, content, beginDate, order, deadline, completeDate, discarded, disuseTime }) {
  try {
    const where = {
      id,
    };
    const todo = {
      order,
      deadline,
      discarded,
    };
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
    if (disuseTime) {
      todo.disuseTime = disuseTime;
    }
    const result = await Todo.update(todo, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function todoDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Todo.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function todoBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['title', 'content', 'order', 'beginDate', 'deadline', 'completeDate', 'disuseTime', 'discarded'];
    list.forEach((v) => {
      if (v.url) {
        const item = {};
        keys.forEach((key) => {
          item[key] = v[key];
        });
        dataes.push(item);
      }
    });
    let len = dataes.length;
    if (len) {
      while (len > 0) {
        const datas = dataes.splice(0, 100);
        let values = await Todo.bulkCreate(datas, { ignoreDuplicates: true });
        values = values.map((row) => row.dataValues);
        values = values.filter((v) => !!v.id);
        result.push(...values);
        len = dataes.length;
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
