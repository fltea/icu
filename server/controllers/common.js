import { notExistInfo } from '../model/ErrorInfos.js';
import { SuccessModel, ErrorModel } from '../model/ResModel.js';
import { FILE_DIR, BACKUP_DIR, FLTYPE, FLTAG, METYPE, MECHANNEL, STTYPE, TOSTATE } from '../conf/constant.js';

import models from '../db/models/index.js';
import { formatDate, deepCopy } from '../utils/tools.js';
import { appendFile, getFiles, reqiureFile, statDir } from '../utils/files.js';

function filepath2url(fpath) {
  let url = fpath.split(`${FILE_DIR}`).pop();
  url = url.replace(/\\/g, '');
  url = `/${FILE_DIR}/${url}`;
  return url;
}

/**
 * 上传文件
 * @param {Object} files
 * @returns
 */
export function uploadFile(files) {
  const list = Object.keys(files);
  let result;
  list.forEach((key) => {
    const file = files[key];
    const url = filepath2url(file.filepath);
    const fileObj = {
      url,
      size: file.size,
      mimetype: file.mimetype,
      name: file.originalFilename,
    };
    if (!result) {
      result = fileObj;
    } else {
      result = [result, fileObj];
    }
  });
  // console.log(result);
  return new SuccessModel({ data: result });
}

/**
 * 备份数据
 *
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
          if (!belongItems[bItem.name]) {
            belongItems[bItem.name] = {};
          }
          let belongItem = await bItem.model.findOne({
            where: {
              id: val,
            },
          });
          if (belongItem) {
            belongItem = belongItem.dataValues;
            const { id } = belongItem;
            value[`belong-${bname}-${bItem.name}`] = id;
            if (!belongItems[bItem.name][id]) {
              belongItems[bItem.name][id] = belongItem;
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
export async function backupDatas() {
  const date = formatDate({ format: 'YYYY-mm-dd' });
  const lpath = `${BACKUP_DIR}/${date}`;
  statDir(lpath);
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

  return new SuccessModel({
    message: '備份數據成功',
  });
}

/**
 * 备份数据 还原
 */
function formatItem(item) {
  const isAt = /At$/;
  delete item.id;
  Object.keys(item).forEach((v) => {
    if (isAt.test(v)) {
      delete item[v];
    }
  });
}
function setData(item, belongsTo) {
  const value = deepCopy(item);
  const isBelong = /^belong-/;
  const keys = Object.keys(value);
  let index = 0;
  const max = keys.length;
  formatItem(value);
  while (index < max) {
    const key = keys[index];
    if (isBelong.test(key)) {
      const oval = value[key];
      const arrs = key.split('-');
      const model = arrs.pop();
      const attr = arrs.pop();
      const val = belongsTo[model][oval];
      value[attr] = +val;
    }
    index += 1;
  }

  return value;
}
async function getIds(item, datas) {
  const keys = Object.keys(datas);
  let i = 0;
  const max = keys.length;
  while (i < max) {
    const key = keys[i];
    const value = datas[key];
    formatItem(value);
    const bresult = await item.findOne({
      where: value,
      attributes: ['id'],
    });
    if (bresult) {
      datas[key] = bresult.dataValues.id;
    }
    i += 1;
  }
}
async function setDatas(type, date) {
  const item = models[type];
  const lpath = `${BACKUP_DIR}/${date}`;
  let result = reqiureFile(`${lpath}/${type}.json`);
  if (!result) {
    return null;
  }
  result = JSON.parse(result);
  if (result.lastTime === date) {
    return result;
  }
  const belongsTo = deepCopy(result.belongsTo);
  if (belongsTo) {
    let i = 0;
    const keys = Object.keys(belongsTo);
    const max = keys.length;
    while (i < max) {
      const model = keys[i];
      // 插入旧数据
      await setDatas(model, date);
      // 查询新数据 id
      const oitems = belongsTo[model];
      await getIds(models[model], oitems);
      i += 1;
    }
  }
  let li = 0;
  const { list } = result;
  const max = list.length;
  while (li < max) {
    // const belongsTo
    const litem = setData(list[li], belongsTo);
    await item.create(litem);
    li += 1;
  }
  result.lastTime = date;
  appendFile(`${lpath}/${type}.json`, JSON.stringify(result), { flag: 'w' });
  return result;
}
export async function restoreDatas({ date }) {
  const keys = Object.keys(models);
  let i = 0;
  const len = keys.length;
  const result = [];
  for (; i < len; i++) {
    const key = keys[i];
    const iresult = await setDatas(key, date);
    result.push(iresult);
  }

  const hasData = result.some((v) => !!v);
  if (hasData) {
    return new SuccessModel({
      message: `数据已还原到${date}`,
    });
  }

  return new ErrorModel(notExistInfo);
}

/**
 * 备份数据列表
 */
export async function backups() {
  const list = getFiles(BACKUP_DIR);

  return new SuccessModel(list);
}

/**
 * 默认设置
 */
export async function getOptions() {
  const flow = {
    type: FLTYPE.split(','),
    tag: FLTAG.split(','),
  };

  const media = {
    type: METYPE.split(','),
    channel: MECHANNEL.split(','),
  };

  const statistic = {
    type: STTYPE.split(','),
  };

  const todo = {
    state: TOSTATE.split(','),
  };

  return new SuccessModel({
    flow,
    media,
    statistic,
    todo,
  });
}
