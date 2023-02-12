import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Article } = models;
/**
 * 根據ID獲取article
 * @param {number} id ID
 */
export async function articleInfo(id) {
  try {
    const where = {
      id,
    };

    const result = await Article.findOne({
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

export async function articleList({ title, tag, author, content, translator, platform, clutter, publishDate, link, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const where = {};

    if (title) {
      where.title = {
        [Op.like]: title,
      };
    }
    if (tag) {
      where.tag = tag;
    }
    if (author) {
      where.author = author;
    }
    if (content) {
      where.content = {
        [Op.like]: content,
      };
    }
    if (translator) {
      where.translator = translator;
    }
    if (platform) {
      where.platform = platform;
    }
    if (clutter) {
      where.clutter = clutter;
    }
    if (link) {
      where.link = link;
    }
    if (publishDate) {
      where.publishDate = publishDate;
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
    const result = await Article.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function articleAdd({ title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source, clutter }) {
  try {
    const result = await Article.create({ title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source, clutter });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function articleUpdate({ id, title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source, clutter }) {
  try {
    const where = {
      id,
    };
    const result = await Article.update({ title, tag, content, author, translator, link, platform, links, publish, price, publishDate, todo, book, cover, remark, source, clutter }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function articleDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Article.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function articleBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['title', 'tag', 'content', 'author', 'translator', 'link', 'platform', 'links', 'publish', 'price', 'publishDate', 'todo', 'book', 'cover', 'remark', 'source', 'clutter'];
    list.forEach((v) => {
      if (v.title) {
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
        let values = await Article.bulkCreate(datas, { ignoreDuplicates: true });
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
