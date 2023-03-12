import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { BACKUP_DIR } from '../conf/constant.js';
import { appendFile, hashBrFile, reqiureFile } from '../utils/files.js';
import { deepCopy } from '../utils/tools.js';

/**
 * 获取表所有数据
 * @param {string} type
 */
async function getDatas(type) {
  const item = models[type];
  const belong = {};
  const textList = [];
  const text = {};
  const attris = item.getAttributes();
  const keys = Object.keys(attris);
  if (keys.length) {
    keys.forEach((key) => {
      const temp = attris[key];
      // 外键
      if (temp.references) {
        const { model } = temp.references;
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
      }

      if (temp.type.toString() === 'TEXT') {
        textList.push(key);
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

    if (textList.length) {
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
    const datas = {
      data,
    };
    if (Object.keys(text).length) {
      datas.text = text;
      data.text = true;
    }

    return datas;
  }
  return null;
}

export async function saveDatas(lpath) {
  const keys = Object.keys(models);
  let i = 0;
  const len = keys.length;
  for (; i < len; i++) {
    const key = keys[i];
    const result = await getDatas(key, lpath);
    if (result) {
      const { data, text } = result;
      appendFile(`${lpath}/${key}.json`, JSON.stringify(data), { flag: 'w' });
      if (text) {
        hashBrFile(lpath, key, JSON.stringify(text));
      }
    }
  }
}

/**
 * 恢复所有的 text
 */
async function setText(lpath, model, ids, attrs) {
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
 * 获取所有属性列
 */
function getAttributes(item) {
  const isAt = /At$/;
  const attris = item.getAttributes();
  return Object.keys(attris).filter((key) => !isAt.test(key));
}

/**
 * 格式化数据
 */
function formatItem(data, attrs, belongsTo) {
  const item = deepCopy(data);
  const isBelong = /^belong-/;
  delete item.id;
  Object.keys(item).forEach((key) => {
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
    } else if (!attrs.includes(key)) {
      delete item[key];
    }
  });
  return item;
}

/**
 * 获取 id
 */
async function getIds(item, datas) {
  const attrs = getAttributes(item);
  const keys = Object.keys(datas);
  let i = 0;
  const max = keys.length;
  const attris = item.getAttributes();
  const attrikeys = Object.keys(attris).filter((k) => attris[k].type.toString() === 'TEXT');
  while (i < max) {
    const key = keys[i];
    let value = datas[key];
    value = formatItem(value, attrs);
    attrikeys.forEach((k) => {
      delete value[k];
    });
    console.log(value);
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
async function createDatas({ type, date, types }) {
  console.log('createDatas', type);
  const item = models[type];
  const lpath = `${BACKUP_DIR}/${date}`;
  let result = reqiureFile(`${lpath}/${type}.json`);
  if (!result) {
    return null;
  }
  result = JSON.parse(result);
  const belongsTo = deepCopy(result.belongsTo);
  let belongsSelf = false;

  if (belongsTo) {
    let i = 0;
    const keys = Object.keys(belongsTo);
    const max = keys.length;
    while (i < max) {
      const model = keys[i];
      if (model !== type) {
        if (!types.includes(model)) {
          // 插入其他旧数据
          await createDatas({ type: model, date, types });
        }
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
  const attrs = getAttributes(item);
  const textIds = {};
  while (li < max) {
    // const belongsTo
    const oitem = list[li];
    const OID = oitem.id;
    const litem = formatItem(oitem, attrs, belongsTo);
    const [createItem] = await item.findOrCreate({
      where: litem,
    });
    const NID = createItem.dataValues.id;
    if (belongsSelf) {
      const datas = belongsTo[type][OID];
      if (datas) {
        belongsTo[type][OID] = NID;
      }
    }
    textIds[OID] = NID;
    li += 1;
  }
  await setText(lpath, type, textIds, attrs);
  types.push(type);
  console.log('createDatas end', type);
  return result;
}

export async function setDatas(date) {
  const keys = Object.keys(models);
  let i = 0;
  const len = keys.length;
  const result = [];
  const types = [];
  for (; i < len; i++) {
    const key = keys[i];
    const iresult = await rollBack(createDatas, { type: key, date, types });
    result.push(iresult);
  }
  return result;
}
