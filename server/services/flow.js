import models from '../db/models/index.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Flow } = models;
/**
 * 根據ID獲取flow
 * @param {number} id ID
 */
export async function flowInfo(id) {
  try {
    const where = {
      id,
    };

    const result = await Flow.findOne({
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

export async function flowList({ type, tag, means, inAccount, outAccount, createTime, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {};
    const where = {};

    if (type) {
      where.type = type;
    }
    if (tag) {
      where.tag = tag;
    }
    if (means) {
      where.means = means;
    }
    if (inAccount) {
      where.inAccount = inAccount;
    }
    if (outAccount) {
      where.outAccount = outAccount;
    }
    if (createTime) {
      where.createTime = createTime;
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Flow.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function flowAdd({ type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark }) {
  try {
    const result = await Flow.create({ type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function flowUpdate({ id, type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark }) {
  try {
    const where = {
      id,
    };
    const result = await Flow.update({ type, createTime, fee, commission, amount, price, rete, beginDate, endDate, name, tag, means, inAccount, outAccount, tieRelation, remark }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function flowDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Flow.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function flowBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['type', 'createTime', 'fee', 'commission', 'amount', 'price', 'rete', 'beginDate', 'endDate', 'name', 'tag', 'means', 'inAccount', 'outAccount', 'tieRelation', 'remark'];
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
        let values = await Flow.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
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
