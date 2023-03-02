import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Clutter } = models;

/**
 * 获取豆列
 */
export async function doulistList({ title, aurthor, page = 1, limit = PAGE_SIZE }) {
  const where = {};
  const ors = [];
  if (title) {
    ors.push({
      [Op.like]: `title:'%${title}%`,
    });
  }
  if (aurthor) {
    ors.push({
      [Op.like]: `aurthor:'%${aurthor}%`,
    });
  }
  if (ors.length) {
    where.content = {
      [Op.or]: ors,
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
  const result = await Clutter.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  const data = {
    count: result.count,
    list,
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }
  return data;
}

/**
 * 获取豆列详情
 */
export async function doulistInfo(id) {
  const where = {
    type: 'doulist',
    phrase: id,
  };
  let result = await Clutter.findOne({
    where,
  });
  if (result) {
    result = result.dataValues;
  }
  return result;
}

/**
 * 新增豆列
 */
export async function createDoulist({ id, title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content }) {
  const doulist = { title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content };
  const clutter = {
    type: 'doulist',
    phrase: id,
    content: JSON.stringify(doulist),
  };
  let result = await Clutter.create(clutter);
  if (result) {
    result = result.dataValues;
  }
  return result;
}

/**
 * 修改豆列
 */
export async function updateDoulist({ id, title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content }) {
  const doulist = { title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content };
  const where = {
    type: 'doulist',
    phrase: id,
  };
  const result = await Clutter.update({
    content: JSON.stringify(doulist),
  }, {
    where,
  });

  return result[0] > 0;
}

/**
 * 获取小组
 */
export async function groupList({ name, page = 1, limit = PAGE_SIZE }) {
  const where = {};
  if (name) {
    where.content = {
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
  const result = await Clutter.findAndCountAll(search);
  const list = result.rows.map((row) => {
    const value = row.dataValues;
    const item = JSON.parse(value.content);
    item.clutter = value.id;
    item.id = value.phrase;
    return item;
  });

  const data = {
    count: result.count,
    list,
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }
  return data;
}

/**
 * 获取小组详情
 */
export async function groupInfo(id) {
  const where = {
    type: 'dgroup',
    phrase: id,
  };
  let result = await Clutter.findOne({
    where,
  });
  if (result) {
    result = result.dataValues;
  }
  return result;
}

/**
 * 新增小组
 */
async function addGroup({ id, name, info, content, tags }) {
  const group = { name, info, content, tags };
  const clutter = {
    type: 'dgroup',
    phrase: id,
    content: JSON.stringify(group),
  };
  let result = await Clutter.create(clutter);
  if (result) {
    result = result.dataValues;
  }
  return result;
}
export async function createGroup({ id, name, info, content, tags }) {
  const result = await rollBack(addGroup, { id, name, info, content, tags });
  return result;
}

/**
 * 修改小组
 */
export async function updateGroup({ id, name, info, content, tags }) {
  const group = { name, info, content, tags };
  const where = {
    type: 'dgroup',
    phrase: id,
  };
  const result = await Clutter.update({
    content: JSON.stringify(group),
  }, {
    where,
  });

  return result[0] > 0;
}
