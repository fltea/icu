import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { BACKUP_DIR } from '../conf/constant.js';
import { appendFile, reqiureFile } from '../utils/files.js';
import { deepCopy } from '../utils/tools.js';

/**
 * 获取表所有数据
 * @param {string} type
 */
async function getDatas(type) {
  const item = models[type];
  const belong = {};
  const attris = item.getAttributes();
  const keys = Object.keys(attris).filter((key) => !!attris[key].references);
  if (keys.length) {
    keys.forEach((key) => {
      const { model } = attris[key].references;
      let name = model.substring(0, model.length - 1);
      let table = models[name];
      if (!table) {
        table = models[model];
        name = model;
      }

      if (table) {
        belong[key] = {
          name,
          model: table,
        };
      }
    });
  }
  const result = await item.findAll();
  const list = [];
  let belongItems;
  let i = 0;
  const max = result.length;
  while (i < max) {
    const value = result[i].dataValues;
    const belongs = Object.keys(belong);
    const bmax = belongs.length;
    if (bmax) {
      if (!belongItems) {
        belongItems = {};
      }
      let bindex = 0;
      while (bindex < bmax) {
        const bname = belongs[bindex];
        const val = +value[bname];
        if (val) {
          const bItem = belong[bname];
          const bModel = bItem.name;
          if (!belongItems[bModel]) {
            belongItems[bModel] = {};
          }
          let belongItem = await bItem.model.findOne({
            where: {
              id: val,
            },
          });
          if (belongItem) {
            belongItem = belongItem.dataValues;
            const { id } = belongItem;
            value[`belong-${bname}-${bModel}`] = id;
            if (!belongItems[bModel][id]) {
              belongItems[bModel][id] = belongItem;
            }
          }
        }
        bindex += 1;
      }
    }

    list.push(value);
    i += 1;
  }

  if (list.length) {
    const data = {
      list,
    };
    if (belongItems) {
      data.belongsTo = belongItems;
    }
    return data;
  }
  return null;
}

export async function saveDatas(lpath) {
  const keys = Object.keys(models);
  let i = 0;
  const len = keys.length;
  for (; i < len; i++) {
    const key = keys[i];
    const result = await getDatas(key);
    if (result) {
      appendFile(`${lpath}/${key}.json`, JSON.stringify(result), { flag: 'w' });
    }
  }
}

/**
 * 格式化数据
 */
function formatItem(data, belongsTo) {
  const item = deepCopy(data);
  const isAt = /At$/;
  const isBelong = /^belong-/;
  delete item.id;
  Object.keys(item).forEach((key) => {
    if (isAt.test(key)) {
      delete item[key];
    }
    if (isBelong.test(key)) {
      if (belongsTo) {
        const ID = item[key];
        const arrs = key.split('-');
        const model = arrs.pop();
        const attr = arrs.pop();
        const val = belongsTo[model][ID];
        item[attr] = +val;
      }
      delete item[key];
    }
  });
  return item;
}

/**
 * 获取 id
 */
async function getIds(item, datas) {
  const keys = Object.keys(datas);
  let i = 0;
  const max = keys.length;
  while (i < max) {
    const key = keys[i];
    let value = datas[key];
    value = formatItem(value);
    const result = await item.findOne({
      where: value,
      attributes: ['id'],
    });
    if (result) {
      datas[key] = result.dataValues.id;
    }
    i += 1;
  }
}

/**
 * 插入数据
 */
async function createDatas({ type, date }) {
  const item = models[type];
  const lpath = `${BACKUP_DIR}/${date}`;
  let result = reqiureFile(`${lpath}/${type}.json`);
  if (!result) {
    return null;
  }
  result = JSON.parse(result);
  // if (result.lastTime === date) {
  //   return result;
  // }
  const belongsTo = deepCopy(result.belongsTo);
  let belongsSelf = false;

  if (belongsTo) {
    let i = 0;
    const keys = Object.keys(belongsTo);
    const max = keys.length;
    while (i < max) {
      const model = keys[i];
      if (model !== type) {
        // 插入其他旧数据
        await createDatas({ type: model, date });
        // 查询新数据 id
        const oitems = belongsTo[model];
        await getIds(models[model], oitems);
      } else {
        belongsSelf = true;
      }
      i += 1;
    }
  }
  let li = 0;
  const { list } = result;
  const max = list.length;
  while (li < max) {
    // const belongsTo
    const oitem = list[li];
    const litem = formatItem(oitem, belongsTo);
    const [createItem] = await item.findOrCreate({
      where: litem,
    });
    if (belongsSelf) {
      const datas = belongsTo[type][oitem.id];
      if (datas) {
        belongsTo[type][oitem.id] = createItem.dataValues.id;
      }
    }
    li += 1;
  }
  result.lastTime = date;
  appendFile(`${lpath}/${type}.json`, JSON.stringify(result), { flag: 'w' });
  return result;
}

export async function setDatas(date) {
  const keys = Object.keys(models);
  let i = 0;
  const len = keys.length;
  const result = [];
  for (; i < len; i++) {
    const key = keys[i];
    const iresult = await rollBack(createDatas, { type: key, date });
    result.push(iresult);
  }
  return result;
}
