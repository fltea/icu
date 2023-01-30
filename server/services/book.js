import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Book } = models;
/**
 * 根據ID獲取book
 * @param {number} id ID
 */
export async function bookInfo(id) {
  const where = {
    id,
  };

  const result = await Book.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function bookList({ title, tag, author, ISBN, translator, series, publishDate, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
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
  if (ISBN) {
    where.ISBN = ISBN;
  }
  if (translator) {
    where.translator = translator;
  }
  if (series) {
    where.series = series;
  }
  if (publishDate) {
    where.publishDate = publishDate;
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Book.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function bookAdd({ title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark }) {
  const result = await Book.create({ title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark });
  return result.dataValues;
}
export async function bookUpdate({ id, title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark }) {
  const where = {
    id,
  };
  const result = await Book.update({ title, name, abstract, author, translator, ISBN, publish, produced, series, binding, pages, price, publishDate, cover, tag, remark }, {
    where,
  });
  return result[0] > 0;
}
export async function bookDelete(id) {
  const where = {
    id,
  };

  const result = Book.destroy({
    where,
  });

  return result > 0;
}
export async function bookBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['title', 'name', 'abstract', 'author', 'translator', 'ISBN', 'publish', 'produced', 'series', 'binding', 'pages', 'price', 'publishDate', 'cover', 'tag', 'remark'];
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
        let values = await Book.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.defaultValue);
        result.push(values);
        len = dataes.length;
      }
    }
  }

  return result;
}
