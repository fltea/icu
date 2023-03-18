import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Clutter } = models;

function formatClutter(result) {
  if (!result) {
    return result;
  }
  let data = result;
  if (data.dataValues) {
    data = data.dataValues;
  }
  const content = JSON.parse(data.content);
  const { id: clutter, phrase, type } = data;
  return { clutter, phrase, type, ...content };
}

/**
 * 根據ID獲取 clutter
 * @param {number} id ID
 */
export async function clutterInfo({ id, type, phrase }) {
  const where = {};
  if (id) {
    where.id = id;
  } else {
    where.type = type;
    where.phrase = phrase;
  }
  const search = {
    where,
    raw: true,
  };
  const result = await Clutter.findOne(search);
  return formatClutter(result);
}

export async function clutters({ type, content, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};

  if (type) {
    where.type = type;
  }
  if (content) {
    where.content = {
      [Op.like]: `%${content}%`,
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
  const { rows, count } = await Clutter.findAndCountAll(search);
  const list = rows.map(formatClutter);

  const result = {
    count,
    list,
  };
  if (page) {
    result.page = page;
    result.limit = limit;
  }
  return result;
}

async function addClutter({ type, content, phrase }) {
  let result = await Clutter.create({ type, content, phrase });
  if (result) {
    result = formatClutter(result);
  }
  return result;
}

export async function newClutter(item) {
  const result = await rollBack(addClutter, item);
  return result;
}

export async function changeClutter({ id, content }) {
  const item = await Clutter.findByPk(id);
  if (item) {
    item.content = content;
    await item.save();
  }
  return !!item;
}

export async function deleteClutter(id) {
  const result = await Clutter.destroy({
    where: {
      id,
    },
  });
  return result > 0;
}
