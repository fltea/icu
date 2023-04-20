import models from '../db/models/index.js';
import { PAGE_SIZE } from '../conf/constant.js';
import { rollBack } from '../db/seq.js';

const { Flow } = models;
/**
 * 根據ID獲取flow
 * @param {number} id ID
 */
export async function flowInfo(id) {
  const result = await Flow.findOne({
    where: {
      id,
    },
    raw: true,
  });

  return result;
}

export async function flows({ type, tag, property, inAccount, outAccount, createTime, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};

  if (type) {
    where.type = type;
  }
  if (tag) {
    where.tag = tag;
  }
  if (property) {
    where.means = property;
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
  const result = await Flow.findAndCountAll(search);

  const data = {
    count: result.count,
    list: result.rows,
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }
  return data;
}

async function flowAdd({ type, createTime, fee, commission, amount, price, name, tag, property, inAccount, outAccount, tieRelation, remark }) {
  const result = await Flow.create({ type, createTime, fee, commission, amount, price, name, tag, property, inAccount, outAccount, tieRelation, remark });
  return result.dataValues;
}
export async function newFlow(item) {
  const result = await rollBack(flowAdd, item);
  return result;
}

export async function changeFlow({ id, type, fee, commission, amount, price, name, tag, property, remark }) {
  const where = {
    id,
  };
  const result = await Flow.update({ type, fee, commission, amount, price, name, tag, property, remark }, {
    where,
  });
  return result[0] > 0;
}

async function flowDelete(id) {
  const result = await Flow.destroy({
    where: {
      id,
    },
  });

  return result > 0;
}
export async function deleteFlow(id) {
  const result = await rollBack(flowDelete, id);
  return result;
}
