import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Blog } = models;
/**
 * 根據ID獲取blog
 * @param {number} id ID
 */
export async function blogInfo(id) {
  const where = {
    id,
  };

  const result = await Blog.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function blogList(text, creator, page = 1, limit = PAGE_SIZE) {
  // 查询条件
  const search = {};
  const where = {};

  if (text) {
    where.url = {
      [Op.like]: text,
    };
  }
  if (creator) {
    where.title = creator;
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Blog.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function blogAdd({ text, link, creator, source, remark }) {
  const result = await Blog.create({ text, link, creator, source, remark });
  return result.dataValues;
}
export async function blogUpdate({ id, text, link, creator, source, remark }) {
  const where = {
    id,
  };
  const blog = {};
  if (text) {
    blog.text = text;
  }
  if (link) {
    blog.link = link;
  }
  if (creator) {
    blog.creator = creator;
  }
  if (source) {
    blog.source = source;
  }
  if (remark) {
    blog.remark = remark;
  }
  const result = await Blog.update(blog, {
    where,
  });
  return result[0] > 0;
}
export async function blogDelete(id) {
  const where = {
    id,
  };

  const result = Blog.destroy({
    where,
  });

  return result > 0;
}
export async function blogBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['text', 'link', 'creator', 'source', 'remark'];
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
        let values = await Blog.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.defaultValue);
        result.push(values);
        len = dataes.length;
      }
    }
  }

  return result;
}
