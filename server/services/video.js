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
  try {
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
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 获取列表
 * @param {Object} param
 */
export async function videoList({ title, creator, remark, page, limit = PAGE_SIZE }) {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 新增
 * @param {Object} video
 */
export async function videoAdd({ title, text, url, link, creator, blog, remark }) {
  try {
    const result = await Video.create({ title, text, url, link, creator, blog, remark });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 修改
 */
export async function videoUpdate({ id, title, text, url, link, creator, blog, remark }) {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 删除
 * @param {number} id
 */
export async function videoDelete(id) {
  try {
    const whereOpt = {
      id,
    };
    const result = await Video.destroy({
      where: whereOpt,
    });
    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 批量新增
 * @param {Array} list
 */
export async function videoBulk(list) {
  try {
    const result = [];
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
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
