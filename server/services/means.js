import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Means } = models;
/**
 * 根據ID獲取means
 * @param {number} id ID
 */
export async function meansInfo(id) {
  const where = {
    id,
  };

  const result = await Means.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function meansList({ title, tag, author, content, translator, platform, publishDate, page = 1, limit = PAGE_SIZE }) {
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
  const result = await Means.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function meansAdd({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }) {
  const result = await Means.create({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark });
  return result.dataValues;
}
export async function meansUpdate({ id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }) {
  const where = {
    id,
  };
  const result = await Means.update({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }, {
    where,
  });
  return result[0] > 0;
}
export async function meansDelete(id) {
  const where = {
    id,
  };

  const result = Means.destroy({
    where,
  });

  return result > 0;
}
export async function meansBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['name', 'code', 'organization', 'book', 'found', 'stock', 'beginDate', 'endDate', 'scale', 'price', 'inDate', 'outDate', 'rate', 'amount', 'content', 'remark'];
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
        let values = await Means.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }
  }

  return result;
}
