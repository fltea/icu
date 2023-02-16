import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Mlog } = models;
/**
 * 根據ID獲取 mlog
 * @param {number} id ID
 */
export async function mlogInfo(id) {
  try {
    const where = {
      id,
    };

    const result = await Mlog.findOne({
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

export async function mlogList({ text, creator, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const where = {};
    if (text) {
      where.text = {
        [Op.like]: `%${text}%`,
      };
    }
    if (creator) {
      where.creator = creator;
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
    // 查询
    const result = await Mlog.findAndCountAll(search);
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
  } catch (error) {
    throw new Error(error);
  }
}

export async function mlogAdd({ text, link, creator, source, remark }) {
  try {
    const result = await Mlog.create({ text, link, creator, source, remark });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}

export async function mlogUpdate({ id, text, link, creator, source, remark }) {
  try {
    const where = {
      id,
    };
    const mlog = {
      remark,
    };
    if (text) {
      mlog.text = text;
    }
    if (link) {
      mlog.link = link;
    }
    if (source) {
      mlog.source = source;
    }
    if (creator) {
      mlog.creator = creator;
    }
    const result = await Mlog.update(mlog, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}

export async function mlogDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Mlog.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}

export async function mlogBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['text', 'link', 'creator', 'source', 'remark'];
    list.forEach((v) => {
      if (v.text) {
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
        let values = await Mlog.bulkCreate(datas, { ignoreDuplicates: true });
        // console.log('list', values);
        values = values.map((row) => row.dataValues);
        values = values.filter((v) => !!v.id);
        result.push(...values);
        len = dataes.length;
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
