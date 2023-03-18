import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Media } = models;

export async function mediaInfo(id) {
  const item = await Media.findOne({
    where: {
      id,
    },
    raw: true,
  });
  return item;
}

export async function medias({ title, abstract, type, creator, channel, tag, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};
  if (title) {
    where.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (abstract) {
    where.abstract = {
      [Op.like]: `%${abstract}%`,
    };
  }
  if (creator) {
    where.creator = creator;
  }

  if (type) {
    where.type = type;
  }
  if (channel) {
    where.channel = channel;
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

  const { rows, count } = await Media.findAndCountAll(search);

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

async function addMedia({ url, title, abstract, clutter, type, creator, staff, ISBN, finished, price, channel, publishDate, tag, remark }) {
  const item = { url, title, abstract, clutter, type, creator, staff, ISBN, finished, price, channel, publishDate, tag, remark };
  const result = await Media.create(item);
  return result;
}

export async function newMedia(item) {
  const result = await rollBack(addMedia, item);
  return result;
}

export async function changeMedia({ id, url, title, abstract, clutter, type, creator, staff, ISBN, finished, price, channel, publishDate, tag, remark }) {
  const item = await Media.findByPk(id);
  if (item) {
    const newItem = { url, title, abstract, clutter, type, creator, staff, ISBN, finished, price, channel, publishDate, tag, remark };
    Object.keys(newItem).forEach((key) => {
      if (newItem[key] === undefined) {
        delete newItem[key];
      }
    });
    await item.update(newItem);
    await item.save();
  }
  return !!item;
}

// 刪除
async function delMedia(id) {
  const result = await Media.destroy({
    where: {
      id,
    },
  });

  return result > 0;
}
export async function deleteMedia(id) {
  const result = await rollBack(delMedia, id);
  return result;
}
