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

export async function todoList({ title, content, completeDate, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {};
    const where = {};

    if (title) {
      where.title = {
        [Op.like]: title,
      };
    }
    if (content) {
      where.content = {
        [Op.like]: content,
      };
    }
    if (completeDate) {
      where.beginDate = {
        [Op.lte]: completeDate,
      };
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Todo.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function todoAdd({ title, content, beginDate, endDate, deadline, completeDate, dropDate, remark }) {
  try {
    const result = await Todo.create({ title, content, beginDate, endDate, deadline, completeDate, dropDate, remark });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function todoUpdate({ id, title, content, beginDate, endDate, deadline, completeDate, dropDate, remark }) {
  try {
    const where = {
      id,
    };
    const result = await Todo.update({ title, content, beginDate, endDate, deadline, completeDate, dropDate, remark }, {
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
    const keys = ['title', 'content', 'beginDate', 'endDate', 'deadline', 'completeDate', 'dropDate', 'remark'];
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
        console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
