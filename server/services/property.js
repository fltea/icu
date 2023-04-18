import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Property } = models;
/**
 * 根據ID獲取 property
 * @param {number} id ID
 */
export async function propertyInfo(id) {
  const result = await Property.findOne({
    where: {
      id,
    },
    raw: true,
  });

  return result;
}

export async function propertys({ name, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
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
  const result = await Property.findAndCountAll(search);

  const data = {
    count: result.count,
    list: result.rows,
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }
  return data;
}

async function propertyAdd({ name, type, code, beginDate, endDate, scale, price, inDate, outDate, count, amount, content, remark, media }) {
  const result = await Property.create({ name, type, code, beginDate, endDate, scale, price, inDate, outDate, count, amount, content, remark, media });
  return result.dataValues;
}

export async function newProperty(item) {
  const result = await rollBack(propertyAdd, item);
  return result;
}

export async function changeProperty({ id, name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark, media }) {
  const where = {
    id,
  };
  const result = await Property.update({ name, code, organization, book, found, stock, beginDate, endDate, scale, price, inDate, outDate, rate, amount, content, remark, media }, {
    where,
  });
  return result[0] > 0;
}

async function propertyDelete(id) {
  const result = await Property.destroy({
    where: {
      id,
    },
  });

  return result > 0;
}
export async function deleteProperty(id) {
  const result = await rollBack(propertyDelete, id);
  return result;
}
