import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Record } = models;

export async function recordInfo(id) {
  const item = await Record.findOne({
    where: {
      id,
    },
    raw: true,
  });
  return item;
}

export async function records({ title, content, type, author, platform, tag, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};
  if (title) {
    where.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (content) {
    where.content = {
      [Op.like]: `%${content}%`,
    };
  }
  if (author) {
    where.author = author;
  }

  if (type) {
    where.type = type;
  }
  if (platform) {
    where.platform = platform;
  }
  if (tag) {
    where.tag = {
      [Op.like]: `%${tag}%`,
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

  const { rows, count } = await Record.findAndCountAll(search);

  const result = {
    count,
    list: rows,
  };
  if (page) {
    result.page = page;
    result.limit = limit;
  }
  return result;
}

async function addRecord({ url, title, content, clutter, type, author, authorId, authorLink, authorIp, platform, publishTime, price, tag }) {
  const item = { url, title, content, clutter, type, author, authorId, authorLink, authorIp, platform, publishTime, price, tag };
  const result = await Record.create(item);
  return result;
}

export async function newRecord(item) {
  const result = await rollBack(addRecord, item);
  return result;
}
