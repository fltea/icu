import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Statistic } = models;
/**
 * 根據ID獲取 statistic
 * @param {number} id ID
 */
export async function statisticInfo(id) {
  const where = {
    id,
  };

  const result = await Statistic.findOne({
    where,
    raw: true,
  });
  return result;
}

export async function statistics({ type, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};
  if (type) {
    where.type = type;
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
  const result = await Statistic.findAndCountAll(search);
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

async function statisticAdd({ type, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  let result = await Statistic.create({ type, date, income, expense, found, stock, deposit, bank, cash, remark });
  if (result) {
    result = result.dataValues;
  }
  return result;
}
export async function newStatistic(item) {
  const result = await rollBack(statisticAdd, item);
  return result;
}

export async function changeStatistic({ id, type, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  const where = {
    id,
  };
  const result = await Statistic.update({ type, date, income, expense, found, stock, deposit, bank, cash, remark }, {
    where,
  });
  return result[0] > 0;
}

async function statisticDelete(id) {
  const result = await Statistic.destroy({
    where: {
      id,
    },
  });

  return result > 0;
}
export async function deleteStatistic(id) {
  const result = await rollBack(statisticDelete, id);
  return result;
}
