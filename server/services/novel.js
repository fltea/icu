import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Novel } = models;
/**
 * 根據ID獲取novel
 * @param {number} id ID
 */
export async function novelInfo(id) {
  try {
    const where = {
      id,
    };

    const result = await Novel.findOne({
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

export async function novelList({ title, clutter, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {};
    const where = {};

    if (title) {
      where.title = {
        [Op.like]: title,
      };
    }
    if (clutter) {
      where.clutter = clutter;
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Novel.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function novelAdd({ url, name, title, content, clutter }) {
  try {
    const result = await Novel.create({ url, name, title, content, clutter });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function novelUpdate({ id, url, name, title, content, clutter }) {
  try {
    const where = {
      id,
    };
    const result = await Novel.update({ url, name, title, content, clutter }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function novelDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Novel.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function novelBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['url', 'title', 'content', 'name', 'clutter'];
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
        let values = await Novel.bulkCreate(datas, { ignoreDuplicates: true });
        // console.log('list', values);
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
