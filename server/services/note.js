import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Note } = models;
/**
 * 根據ID獲取note
 * @param {number} id ID
 */
export async function noteInfo(id) {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
}

export async function noteList({ source, article, content, page = 1, limit = PAGE_SIZE }) {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
}

export async function noteAdd({ content, position, source, article }) {
  try {
    const result = await Note.create({ content, position, source, article });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function noteUpdate({ id, content, position, source, article }) {
  try {
    const where = {
      id,
    };
    const result = await Note.update({ content, position, source, article }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function noteDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Note.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function noteBulk(list) {
  try {
    const result = [];
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

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
