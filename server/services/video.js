import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Video } = models;
/**
 * 获取数据
 * @param {*} id
 * @returns
 */
export async function videoInfo(id) {
  const where = {
    id,
  };

  const result = await Video.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

/**
 * 获取列表
 * @param {Object} param
 */
export async function videoList({ title, creator, remark, page, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  const where = {};
  if (title) {
    where.title = {
      [Op.like]: title,
    };
  }
  if (creator) {
    where.creator = {
      [Op.like]: creator,
    };
  }
  if (remark) {
    where.remark = {
      [Op.like]: remark,
    };
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Video.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

/**
 * 新增
 * @param {Object} video
 */
export async function videoAdd({ title, text, url, link, creator, blog, remark }) {
  const result = await Video.create({ title, text, url, link, creator, blog, remark });
  return result.dataValues;
}

/**
 * 修改
 */
export async function videoUpdate({ id, title, text, url, link, creator, blog, remark }) {
  const where = {
    id,
  };
  const video = {};
  if (title) {
    video.title = title;
  }
  if (text) {
    video.text = text;
  }
  if (url) {
    video.url = url;
  }
  if (link) {
    video.link = link;
  }
  if (creator) {
    video.creator = creator;
  }
  if (blog) {
    video.blog = blog;
  }
  if (remark) {
    video.remark = remark;
  }
  const result = await Video.update(video, {
    where,
  });
  return result[0] > 0;
}

/**
 * 删除
 * @param {number} id
 */
export async function videoDelete(id) {
  const whereOpt = {
    id,
  };
  const result = await Video.destroy({
    where: whereOpt,
  });
  return result > 0;
}

/**
 * 批量新增
 * @param {Array} list
 */
export async function videoBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['title', 'text', 'url', 'link', 'creator', 'blog', 'remark'];
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
        let values = await Video.bulkCreate(datas, { ignoreDuplicates: true });
        values = values.map((row) => row.defaultValue);
        result.push(values);
        len = dataes.length;
      }
    }
  }
  return result;
}
