import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Mark } = models;

/**
 * 根据地址获取Mark
 */
export async function markInfo({ id, url }) {
  // 查询条件
  let where;
  let result;
  if (id) {
    where = {
      id,
    };
  } else if (url) {
    where = {
      url,
    };
  }

  if (where) {
    result = await Mark.findOne({
      where,
    });
    if (result) {
      return result.dataValues;
    }
  }

  return result;
}

/**
 * 获取 Mark 列表
 */
export async function markList({ url, title, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  const where = {};
  if (url) {
    where.url = {
      [Op.like]: url,
    };
  }
  if (title) {
    where.title = {
      [Op.like]: title,
    };
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Mark.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

/**
 * 创建 mark
 * @returns
 */
export async function markAdd({ url, title, description, icons }) {
  const result = await Mark.create({
    url, title, description, icons,
  });
  return result.dataValues;
}

/**
 * 修改 mark
 * @returns
 */
export async function markUpdate({ id, url, title, description, icons }) {
  const whereOpt = {
    id,
  };
  const updateData = {
    url, title, description, icons,
  };
  const result = await Mark.update(updateData, {
    where: whereOpt,
  });
  return result[0] > 0;
}

export async function markDelete(id) {
  const whereOpt = {
    id,
  };
  const result = await Mark.destroy({
    where: whereOpt,
  });
  // console.log(result);
  return result > 0;
}

/**
 * 批量插入
 * @param {array} list
 */
export async function markBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['url', 'title', 'description', 'icons'];
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
        let values = await Mark.bulkCreate(datas, { ignoreDuplicates: true });
        values = values.map((row) => row.defaultValue);
        result.push(values);
        len = dataes.length;
      }
    }
  }
  return result;
}
