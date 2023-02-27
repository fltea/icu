import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Entertainment } = models;

/**
 * 根据地址获取Entertainment
 */
export async function entertainmentInfo(id) {
  try {
  // 查询条件
    const where = {
      id,
    };

    const result = await Entertainment.findOne({
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
 * 获取 Entertainment 列表
 */
export async function entertainmentList({ title, tag, creator, staff, clutter, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const where = {};
    if (title) {
      where.title = {
        [Op.like]: title,
      };
    }
    if (tag) {
      where.tag = {
        [Op.like]: tag,
      };
    }
    if (staff) {
      where.staff = {
        [Op.like]: staff,
      };
    }
    if (creator) {
      where.creator = {
        [Op.like]: creator,
      };
    }
    if (clutter) {
      where.clutter = clutter;
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
    const result = await Entertainment.findAndCountAll(search);
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
 * 创建 entertainment
 * @returns
 */
export async function entertainmentAdd({ title, abstract, link, creator, staff, tag, publishDate, clutter, remark }) {
  try {
    const result = await Entertainment.create({
      title, abstract, link, creator, staff, tag, publishDate, clutter, remark,
    });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 修改 entertainment
 * @returns
 */
export async function entertainmentUpdate({ id, title, abstract, link, creator, staff, tag, publishDate, clutter, remark }) {
  try {
    const whereOpt = {
      id,
    };
    const updateData = {
      title, abstract, link, creator, staff, tag, publishDate, clutter, remark,
    };
    const result = await Entertainment.update(updateData, {
      where: whereOpt,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}

export async function entertainmentDelete(id) {
  try {
    const whereOpt = {
      id,
    };
    const result = await Entertainment.destroy({
      where: whereOpt,
    });
    // console.log(result);
    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 批量插入
 * @param {array} list
 */
export async function entertainmentBulk(list) {
  try {
    const result = [];
    if (Array.isArray(list)) {
      const dataes = [];
      const keys = ['title', 'abstract', 'link', 'creator', 'staff', 'tag', 'publishDate', 'clutter', 'remark'];
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
          let values = await Entertainment.bulkCreate(datas, { ignoreDuplicates: true });
          values = values.map((row) => row.dataValues);
          result.push(...values);
          len = dataes.length;
        }
      }
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}
