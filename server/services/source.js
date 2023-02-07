import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Source } = models;
/**
 * 根據ID獲取source
 * @param {number} id ID
 */
export async function sourceInfo(id) {
  try {
    const where = {
      id,
    };

    const result = await Source.findOne({
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

export async function sourceList({ basic, plaform, author, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {};
    const where = {};

    if (basic) {
      where.basic = {
        [Op.like]: basic,
      };
    }
    if (plaform) {
      where.plaform = plaform;
    }
    if (author) {
      where.author = author;
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Source.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function sourceAdd({ basic, basicId, plaform, link, author, authorLink, authorId, authorIp, publishTime }) {
  try {
    const result = await Source.create({ basic, basicId, plaform, link, author, authorLink, authorId, authorIp, publishTime });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function sourceUpdate({ id, basic, basicId, plaform, link, author, authorLink, authorId, authorIp, publishTime }) {
  try {
    const where = {
      id,
    };
    const result = await Source.update({ basic, basicId, plaform, link, author, authorLink, authorId, authorIp, publishTime }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function sourceDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Source.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function sourceBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['basic', 'basicId', 'plaform', 'link', 'author', 'authorLink', 'authorId', 'authorIp', 'publishTime'];
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
        let values = await Source.bulkCreate(datas, { ignoreDuplicates: true });
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
