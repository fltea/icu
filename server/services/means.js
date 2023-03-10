import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Means } = models;
/**
 * 根據ID獲取means
 * @param {number} id ID
 */
export async function meansInfo(id) {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
}

export async function meansList({ name, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const where = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
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
    const result = await Means.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function meansAdd({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }) {
  try {
    const result = await Means.create({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function meansUpdate({ id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }) {
  try {
    const where = {
      id,
    };
    const result = await Means.update({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function meansDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Means.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function meansBulk(list) {
  try {
    const result = [];
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

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
