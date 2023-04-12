import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Mlog } = models;

function formatItem(item) {
  if (!item) {
    return item;
  }
  const data = item.dataValues || item;
  if (data.infos) {
    data.infos = JSON.parse(data.infos);
  }
  return data;
}

/**
 * 根據ID獲取 mlog
 * @param {number} id ID
 */
export async function mlogInfo(id) {
  const where = {
    id,
  };

  const result = await Mlog.findOne({
    where,
    raw: true,
  });
  return formatItem(result);
}

export async function mlogs({ text, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};
  if (text) {
    where.text = {
      [Op.like]: `%${text}%`,
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
  const result = await Mlog.findAndCountAll(search);

  const data = {
    count: result.count,
    list: result.rows.map(formatItem),
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }

  return data;
}

async function mlogAdd({ text, infos }) {
  const result = await Mlog.create({ text, infos });
  return formatItem(result);
}
export async function newMlog(item) {
  const result = await rollBack(mlogAdd, item);
  return result;
}
