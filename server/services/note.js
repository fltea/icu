import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Note } = models;
/**
 * 根據ID獲取note
 * @param {number} id ID
 */
export async function noteInfo(id) {
  const where = {
    id,
  };

  const result = await Note.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function noteList({ source, article, content, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  const where = {};

  if (content) {
    where.content = {
      [Op.like]: content,
    };
  }
  if (article) {
    where.article = article;
  }
  if (source) {
    where.source = {
      [Op.like]: source,
    };
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Note.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function noteAdd({ content, position, source, article }) {
  const result = await Note.create({ content, position, source, article });
  return result.dataValues;
}
export async function noteUpdate({ id, content, position, source, article }) {
  const where = {
    id,
  };
  const result = await Note.update({ content, position, source, article }, {
    where,
  });
  return result[0] > 0;
}
export async function noteDelete(id) {
  const where = {
    id,
  };

  const result = Note.destroy({
    where,
  });

  return result > 0;
}
export async function noteBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['content', 'position', 'source', 'article'];
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
        let values = await Note.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }
  }

  return result;
}
