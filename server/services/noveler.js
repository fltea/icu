import models from '../db/models/index.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Noveler } = models;
/**
 * 根據ID獲取noveler
 * @param {number} id ID
 */
export async function novelerInfo(id) {
  const where = {
    id,
  };

  const result = await Noveler.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function novelerList({ page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Noveler.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function novelerAdd({ domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode }) {
  const result = await Noveler.create({ domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode });
  return result.dataValues;
}
export async function novelerUpdate({ id, domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode }) {
  const where = {
    id,
  };
  const result = await Noveler.update({ domain, domainsearch, titles, author, contents, lists, multlist, listSort, detailurl, details, multpage, detailex, dstart, dend, encode }, {
    where,
  });
  return result[0] > 0;
}
export async function novelerDelete(id) {
  const where = {
    id,
  };

  const result = Noveler.destroy({
    where,
  });

  return result > 0;
}
export async function novelerBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['domain', 'domainsearch', 'titles', 'author', 'contents', 'lists', 'multlist', 'listSort', 'detailurl', 'details', 'multpage', 'detailex', 'dstart', 'dend', 'encode'];
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
        let values = await Noveler.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }
  }

  return result;
}
