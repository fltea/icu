import models from '../db/models/index.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Stats } = models;
/**
 * 根據ID獲取stats
 * @param {number} id ID
 */
export async function statsInfo(id) {
  const where = {
    id,
  };

  const result = await Stats.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function statsList({ type, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  const where = {};
  if (type) {
    where.type = type;
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Stats.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function statsAdd({ type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  const result = await Stats.create({ type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark });
  return result.dataValues;
}
export async function statsUpdate({ id, type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark }) {
  const where = {
    id,
  };
  const result = await Stats.update({ type, name, beginDate, date, income, expense, found, stock, deposit, bank, cash, remark }, {
    where,
  });
  return result[0] > 0;
}
export async function statsDelete(id) {
  const where = {
    id,
  };

  const result = Stats.destroy({
    where,
  });

  return result > 0;
}
export async function statsBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['type', 'name', 'beginDate', 'date', 'income', 'expense', 'found', 'stock', 'deposit', 'bank', 'cash', 'remark'];
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
        let values = await Stats.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }
  }

  return result;
}
