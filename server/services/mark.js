import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
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
      raw: true,
    });
  }

  return result;
}

/**
 * 获取 Mark 列表
 */
export async function marks({ url, title, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};
  if (url) {
    where.url = {
      [Op.like]: `%${url}%`,
    };
  }
  if (title) {
    where.title = {
      [Op.like]: `%${title}%`,
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
  const result = await Mark.findAndCountAll(search);

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

/**
 * 创建 mark
 * @returns
 */
async function markAdd({ url, title, description, icons }) {
  const result = await Mark.create({
    url, title, description, icons,
  });
  return result.dataValues;
}
export async function newMark(item) {
  const result = await rollBack(markAdd, item);
  return result;
}

/**
 * 修改 mark
 * @returns
 */
export async function changeMark({ id, url, title, description, icons }) {
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

async function markDelete(id) {
  const result = await Mark.destroy({
    where: {
      id,
    },
  });
  return result > 0;
}
export async function deleteMark(id) {
  const result = await rollBack(markDelete, id);
  return result;
}

/**
 * 批量插入
 * @param {array} list
 */
export async function bulkMark(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = list.filter((v) => !!v.url);
    let len = dataes.length;
    if (len) {
      while (len > 0) {
        const datas = dataes.splice(0, 100);
        let values = await Mark.bulkCreate(datas, { ignoreDuplicates: true });
        values = values.map((row) => row.dataValues).filter((v) => !!v.id);
        result.push(...values);
        len = dataes.length;
      }
    }
  }
  return result;
}
