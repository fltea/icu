import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Novel } = models;
/**
 * 根據ID獲取novel
 * @param {number} id ID
 */
export async function novelInfo(id) {
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
}

export async function novelList({ title, noveler, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  const where = {};

  if (title) {
    where.title = {
      [Op.like]: title,
    };
  }
  if (noveler) {
    where.noveler = noveler;
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
}

export async function novelAdd({ url, title, content, noveler }) {
  const result = await Novel.create({ url, title, content, noveler });
  return result.dataValues;
}
export async function novelUpdate({ id, url, title, content, noveler }) {
  const where = {
    id,
  };
  const result = await Novel.update({ url, title, content, noveler }, {
    where,
  });
  return result[0] > 0;
}
export async function novelDelete(id) {
  const where = {
    id,
  };

  const result = Novel.destroy({
    where,
  });

  return result > 0;
}
export async function novelBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['url', 'title', 'content', 'noveler'];
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
        console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }
  }

  return result;
}
