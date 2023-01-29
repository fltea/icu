import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Account } = models;
/**
 * 根據ID獲取account
 * @param {number} id ID
 */
export async function accountInfo(id) {
  const where = {
    id,
  };

  const result = await Account.findOne({
    where,
  });

  if (result) {
    return result.dataValues;
  }

  return result;
}

export async function accountList({ name, nickName, platform, phone, email, verify, beginDate, endDate, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const search = {};
  const where = {};

  if (name) {
    where.name = name;
  }
  if (platform) {
    where.platform = platform;
  }
  if (phone) {
    where.phone = phone;
  }
  if (nickName) {
    where.nickName = {
      [Op.like]: nickName,
    };
  }
  if (email) {
    where.email = email;
  }
  if (verify) {
    where.verify = verify;
  }
  if (beginDate) {
    where.beginDate = {
      [Op.lte]: beginDate,
    };
  }
  if (endDate) {
    where.endDate = {
      [Op.lte]: endDate,
    };
  }
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // 查询
  const result = await Account.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  return {
    count: result.count,
    list,
  };
}

export async function accountAdd({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  const result = await Account.create({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark });
  return result.dataValues;
}
export async function accountUpdate({ id, name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  const where = {
    id,
  };
  const account = { name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark };
  if (remark) {
    account.remark = remark;
  }
  const result = await Account.update(account, {
    where,
  });
  return result[0] > 0;
}
export async function accountDelete(id) {
  const where = {
    id,
  };

  const result = Account.destroy({
    where,
  });

  return result > 0;
}
export async function accountBulk(list) {
  const result = [];
  if (Array.isArray(list)) {
    const dataes = [];
    const keys = ['name', 'nickName', 'balance', 'pic', 'desc', 'platform', 'platformURL', 'paswd', 'phone', 'email', 'verify', 'IDCard', 'beginDate', 'endDate', 'remark'];
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
        let values = await Account.bulkCreate(datas, { ignoreDuplicates: true });
        console.log('list', values);
        values = values.map((row) => row.defaultValue);
        result.push(values);
        len = dataes.length;
      }
    }
  }

  return result;
}
