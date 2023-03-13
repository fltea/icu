import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { appendFile, hashBrFile, reqiureFile } from '../utils/files.js';
import { deepCopy } from '../utils/tools.js';

export function allModelKey() {
  return Object.keys(models);
}

/**
 * 获取属性
 */
function getAttributes(item) {
  const attris = item.getAttributes();
  const keys = Object.keys(attris);
  const belong = {};
  const textList = [];
  const allkeys = [];
  const isAt = /At$/;
  keys.forEach((key) => {
    const temp = attris[key];
    // 外键
    if (temp.references) {
      const { model } = temp.references;
      let name = model;
      let table = models[name];
      while (!table) {
        name = name.slice(0, -1);
        table = models[name];
      }
      table = null;
      belong[key] = name;
    }

    if (temp.type.toString() === 'TEXT') {
      textList.push(key);
    }
    if (!isAt.test(key)) {
      allkeys.push(key);
    }
  });

  return {
    allkeys,
    belong,
    textList,
  };
}

/**
 * 获取所有数据
 */
export async function saveDatas(lpath, model) {
  const table = models[model];
  const result = await table.findAll({
    raw: true,
  });
  if (result.length) {
    const { textList } = getAttributes(table);
    const text = {};
    result.forEach((value) => {
      textList.forEach((key) => {
        const textStr = value[key];
        if (textStr) {
          if (!text[value.id]) {
            text[value.id] = {};
          }
          text[value.id][key] = textStr;
          value[key] = '';
        }
      });
    });
    const data = {
      list: result,
      textCol: textList,
    };
    if (Object.keys(text).length) {
      data.text = true;
    }
    appendFile(`${lpath}/${model}.json`, JSON.stringify(data), { flag: 'w' });
    if (data.text) {
      hashBrFile(lpath, model, JSON.stringify(text));
    }
  }
  return true;
}

/**
 * 恢复所有的 text
 */
async function setText(lpath, model, ids, attrs) {
  console.log('setText 恢复所有的 text', model);
  let data = hashBrFile(lpath, model);
  if (!data) {
    return;
  }
  data = JSON.parse(data);
  const keys = Object.keys(data);
  const modelItem = models[model];
  let max = keys.length;
  while (max) {
    const key = keys.pop();
    max = keys.length;
    const item = data[key];
    const itemkeys = Object.keys(item);
    const iresult = {};
    itemkeys.forEach((v) => {
      if (attrs.includes(v)) {
        iresult[v] = item[v];
      }
    });
    const id = +ids[key];
    await modelItem.update(iresult, {
      where: {
        id,
      },
    });
  }
}

/**
 * 格式化数据
 */
function formatItem(data, attrs, belong, oIds) {
  const item = deepCopy(data);
  delete item.id;
  const bolongs = Object.keys(belong);
  Object.keys(item).forEach((key) => {
    if (!attrs.includes(key)) {
      delete item[key];
    } else if (bolongs.includes(key)) {
      const value = item[key];
      if (value) {
        const model = belong[key];
        const idlist = oIds[model];
        const oId = +idlist[value];
        if (!isNaN(oId)) {
          item[key] = +idlist[value];
        }
      }
    }
  });
  return item;
}

/**
 * 插入数据
 */
async function createDatas({ table, lpath, oIds }) {
  const item = models[table];
  let result = reqiureFile(`${lpath}/${table}.json`);
  if (!result) {
    return;
  }
  result = JSON.parse(result);
  const { allkeys, belong } = getAttributes(item);
  let bolongs = Object.values(belong);
  bolongs = bolongs.filter((v) => v !== table);

  const types = Object.keys(oIds);
  let max = bolongs.length;
  while (max) {
    const model = bolongs.shift();
    max = bolongs.length;
    if (!types.includes(model)) {
      // 插入其他旧数据
      await createDatas({ table: model, lpath, oIds });
    }
  }
  bolongs = null;

  const list = deepCopy(result.list);
  max = list.length;
  const ids = {};
  oIds[table] = ids;
  while (max) {
    const oitem = list.shift();
    const OID = oitem.id;
    const litem = formatItem(oitem, allkeys, belong, oIds);
    console.log('table', table, ids);
    const [createItem] = await item.findOrCreate({
      where: litem,
      raw: true,
    });
    if (createItem.id !== OID) {
      ids[OID] = createItem.id;
    }
    max = list.length;
  }
  await setText(lpath, table, ids, allkeys);
}

export async function setDatas({ table, lpath, oIds }) {
  await rollBack(createDatas, { table, lpath, oIds });
}
