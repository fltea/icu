import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Account, Atie } = models;
/**
 * 根據ID獲取account
 * @param {number} id ID
 */
export async function accountInfo(id) {
  const where = {
    id,
  };
  const search = {
    where,
    include: Atie,
  };

  const result = await Account.findOne(search);

  if (result) {
    const data = result.dataValues;
    const list = await Atie.findAll({
      where: {
        tied: id,
      },
      raw: true,
    });
    data.Ties = list;
    return data;
  }

  return result;
}

export async function accounts({ name, nickName, platform, phone, email, verify, beginDate, endDate, page = 1, limit = PAGE_SIZE }) {
  // 查询条件
  const where = {};

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }
  if (platform) {
    where.platform = platform;
  }
  if (phone) {
    where.phone = phone;
  }
  if (nickName) {
    where.nickName = {
      [Op.like]: `%${nickName}%`,
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
  const result = await Account.findAndCountAll(search);

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

async function accountAdd({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
  const result = await Account.create({ name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark });
  return result.dataValues;
}
export async function newAccount(item) {
  const result = await rollBack(accountAdd, item);
  return result;
}

export async function changeAccount({ id, name, nickName, balance, pic, desc, platform, platformURL, paswd, phone, email, verify, IDCard, beginDate, endDate, remark }) {
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

async function accountDelete(id) {
  const result = await Account.destroy({
    where: {
      id,
    },
  });
  return result > 0;
}
export async function deleteAccount(id) {
  const result = await rollBack(accountDelete, id);
  return result;
}

export async function accountTie({ tied, tiedName, account, accountName, tieDate, untieDate, remark }) {
  const result = await Atie.create({ tied, tiedName, account, accountName, tieDate, untieDate, remark });
  return result.dataValues;
}
export async function tieAccount(item) {
  const result = await rollBack(accountTie, item);
  return result;
}

export async function changeAccountTie({ id, tiedName, accountName, tieDate, untieDate, remark }) {
  const where = {
    id,
  };
  const account = {};
  if (tiedName) {
    account.tiedName = tiedName;
  }
  if (accountName) {
    account.accountName = accountName;
  }
  if (remark) {
    account.remark = remark;
  }
  if (tieDate) {
    account.tieDate = tieDate;
  }
  if (untieDate) {
    account.untieDate = untieDate;
  }
  const result = await Atie.update(account, {
    where,
  });
  return result[0] > 0;
}
