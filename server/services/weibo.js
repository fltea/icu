import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
// import { Op } from '../db/types.js';
// import { PAGE_SIZE } from '../conf/constant.js';

const { Record, Clutter } = models;

function formatClutter(data) {
  const result = data.dataValues;
  const content = JSON.parse(result.content);
  return { clutter: result.id, ...content };
}

export async function blockList() {
  const result = await Clutter.findOne({
    where: {
      type: 'weiboblock',
    },
    raw: true,
  });
  return result;
}

// 新增
async function addBlock(content) {
  const clutter = {
    type: 'weiboblock',
    content,
  };
  let result = await Clutter.create(clutter);
  if (result) {
    result = formatClutter(result);
  }
  return result;
}
export async function blockAdd(content) {
  const result = await rollBack(addBlock, content);
  return result;
}
export async function blockMod(id, content) {
  const where = {
    id,
  };
  const result = await Clutter.update({
    content,
  }, {
    where,
  });

  return result[0] > 0;
}

export async function userList(ids) {
  const search = {
    where: {
      type: 'weibouser',
    },
    raw: true,
  };
  if (ids) {
    search.attributes = ['phrase'];
  }
  // console.log('userList', search);
  const result = await Clutter.findAll(search);
  if (ids) {
    return result.map((v) => v.phrase);
  }
  return result;
}

// 新增
async function addUser(data) {
  const clutter = {
    type: 'weibouser',
    phrase: data.id,
    content: JSON.stringify(data),
  };
  let result = await Clutter.create(clutter);
  if (result) {
    result = formatClutter(result);
  }
  return result;
}
export async function userAdd(data) {
  const result = await rollBack(addUser, data);
  return result;
}

// 新增
async function addRecord(record) {
  let result = await Record.create(record);
  if (result) {
    result = result.dataValues;
  }
  return result;
}
export async function recordAdd(data) {
  const result = await rollBack(addRecord, data);
  return result;
}
