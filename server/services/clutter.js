import models from '../db/models/index.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Clutter, Novel } = models;
/**
 * 根據ID獲取 clutter
 * @param {number} id ID
 */
export async function clutterInfo({ id, type, phrase }) {
  let result;
  try {
    const where = {};
    if (id) {
      where.id = id;
    } else {
      where.type = type;
      where.phrase = phrase;
    }
    result = await Clutter.findOne({
      where,
    });

    if (result) {
      result = result.dataValues;
    }
  } catch (error) {
    throw new Error(error);
  }
  return result;
}

export async function clutterList({ type, page = 1, limit = PAGE_SIZE }) {
  let result;
  try {
    // 查询条件
    const search = {};

    if (type) {
      search.where = {
        type,
      };
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }

    if (type === 'noveler') {
      search.include = Novel;
    }

    // 查询
    result = await Clutter.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    result = {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
  return result;
}

export async function clutterAdd({ type, content, phrase }) {
  let result;
  try {
    result = await Clutter.create({ type, content, phrase });

    if (result) {
      result = result.dataValues;
    }
  } catch (error) {
    throw new Error(error);
  }
  return result;
}

export async function clutterUpdate({ id, type, content, phrase }) {
  let result;
  try {
    const where = {
      id,
    };
    result = await Clutter.update({ type, content, phrase }, {
      where,
    });
    result = result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
  return result;
}
export async function clutterDelete(id) {
  let result;
  try {
    const where = {
      id,
    };

    result = await Clutter.destroy({
      where,
    });

    result = result > 0;
  } catch (error) {
    throw new Error(error);
  }
  return result;
}
export async function clutterBulk(list) {
  const result = [];
  try {
    const dataes = [];
    const keys = ['type', 'content', 'phrase'];
    list.forEach((v) => {
      if (v.type) {
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
        let values = await Clutter.bulkCreate(datas, { ignoreDuplicates: true });
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }
  } catch (error) {
    throw new Error(error);
  }

  return result;
}
