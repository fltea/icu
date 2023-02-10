import models from '../db/models/index.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Chapter } = models;
/**
 * 根據ID獲取chapter
 * @param {number} id ID
 */
export async function chapterInfo({ id, url }) {
  try {
    const where = {};
    if (id) {
      where.id = id;
    }
    if (url) {
      where.url = url;
    }

    const result = await Chapter.findOne({
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

export async function chapterList({ novel, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {};
    const where = {};
    if (novel) {
      where.novel = novel;
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Chapter.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function chapterAdd({ url, title, novel, content, author }) {
  try {
    const result = await Chapter.create({ url, title, novel, content, author });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function chapterUpdate({ id, url, title, novel, content, author }) {
  try {
    const where = {
      id,
    };
    const result = await Chapter.update({ url, title, novel, content, author }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function chapterDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Chapter.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function chapterBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['url', 'title', 'novel', 'content', 'author'];
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
        let values = await Chapter.bulkCreate(datas, { ignoreDuplicates: true });
        // console.log('list', values);
        values = values.map((row) => row.dataValues).filter((v) => !!v.id);
        result.push(...values);
        len = dataes.length;
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
