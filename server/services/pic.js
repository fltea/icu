import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Pic } = models;

/**
 * 获取数据
 * @param {*} url
 * @returns
 */
export async function picInfo(url) {
  try {
    const where = {
      url,
    };

    const result = await Pic.findOne({
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
export async function picList({ creator, remark, page, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {};
    const where = {};
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
    const result = await Pic.findAndCountAll(search);
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
 * @param {Object} pic
 */
export async function picAdd({ url, link, creator, text, remark }) {
  try {
    const result = await Pic.create({ url, link, creator, text, remark });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 更新
 */
export async function picUpdate({ id, link, creator, text, remark }) {
  try {
    const where = {
      id,
    };
    const pic = {};
    if (link) {
      pic.link = link;
    }
    if (text) {
      pic.text = text;
    }
    if (creator) {
      pic.creator = creator;
    }
    if (remark) {
      pic.remark = remark;
    }
    const result = await Pic.update(pic, {
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
export async function picDelete(id) {
  try {
    const whereOpt = {
      id,
    };
    const result = await Pic.destroy({
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
export async function picBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['url', 'link', 'creator', 'text', 'remark'];
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
        let values = await Pic.bulkCreate(datas, { ignoreDuplicates: true });
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
