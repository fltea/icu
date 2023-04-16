import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';
import { rollBack } from '../db/seq.js';

const { Article } = models;
/**
 * 根據ID獲取article
 * @param {number} id ID
 */
export async function articleInfo(id) {
  const result = await Article.findOne({
    where: {
      id,
    },
    raw: true,
  });

  return result;
}

export async function articles({ title, tag, content, publishDate, page = 1, limit = PAGE_SIZE }) {
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
  if (content) {
    where.content = {
      [Op.like]: `%${content}%`,
    };
  }
  if (publishDate) {
    where.publishDate = publishDate;
  }
  const search = {
    where,
    raw: true,
  };
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Article.findAndCountAll(search);

  const data = {
    count: result.count,
    list: result.rows,
  };
  if (page) {
    data.limit = limit;
    data.page = page;
  }

  return data;
}

async function articleAdd({ title, tag, content, publishDate, cover }) {
  const result = await Article.create({ title, tag, content, publishDate, cover });
  return result.dataValues;
}
export async function newArticle(item) {
  const result = rollBack(articleAdd, item);
  return result;
}

export async function changeArticle({ id, title, tag, content, publishDate, cover }) {
  const where = {
    id,
  };
  const result = await Article.update({ title, tag, content, publishDate, cover }, {
    where,
  });
  return result[0] > 0;
}

async function articleDelete(id) {
  const result = await Article.destroy({
    where: {
      id,
    },
  });

  return result > 0;
}
export async function deleteArticle(id) {
  const result = await rollBack(articleDelete, id);
  return result;
}
