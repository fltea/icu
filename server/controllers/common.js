import { notExistInfo } from '../model/ErrorInfos.js';
import { SuccessModel, ErrorModel } from '../model/ResModel.js';
import { FILE_DIR, BACKUP_DIR } from '../conf/constant.js';
import catchError from '../utils/tcatch.js';

import models from '../db/models/index.js';
import { formatDate } from '../utils/tools.js';
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
  try {
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
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据
 *
 */
async function getDatas(type) {
  const item = models[type];
  const attris = item.getAttributes();
  let keys = Object.keys(attris).filter((key) => !!attris[key].references).map((key) => attris[key].references.model);
  keys = keys.map((key) => key.substr(0, key.length - 1));
  const search = {};
  if (keys.length) {
    const include = [];
    const includes = [];
    keys.forEach((key) => {
      let name = key.substr(0, key.length - 1);
      let table = models[name];
      if (!table) {
        table = models[key];
        name = key;
      }
      if (table) {
        includes.push(name);
        include.push(table);
      }
    });
    search.include = include;
    keys = includes;
  }
  const result = await item.findAll(search);
  const list = result.map((row) => {
    const value = row.dataValues;
    keys.forEach((key) => {
      const val = value[key];
      value[key] = val.dataValues;
    });
    return value;
  });

  if (list.length) {
    const data = {
      list,
    };
    if (keys.length) {
      data.belongsTo = keys;
    }
    return data;
  }
  return null;
}
export async function backupDatas() {
  try {
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
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据 还原
 */
async function setDatas(type, date) {
  const item = models[type];
  const lpath = `${BACKUP_DIR}/${date}`;
  let result = reqiureFile(`${lpath}/${type}.json`);
  if (!result) {
    return result;
  }
  result = JSON.parse(result);
  if (result.lastTime === date) {
    return result;
  }
  const { belongsTo, list } = result;
  if (belongsTo) {
    let i = 0;
    const max = belongsTo.length;
    while (i < max) {
      await setDatas(belongsTo[i], date);
      i += 1;
    }
  }
  let li = 0;
  const max = list.length;
  while (li < max) {
    // const belongsTo
    const litem = list[li];
    const belogs = belongsTo.map((key) => litem[key]);
    let bi = 0;
    const lmax = belogs.length;
    while (bi < lmax) {
      const bitem = belogs[bi];
      if (bitem) {
        const key = belongsTo[bi];
        let bresult = await models[key].findOne({
          where: bitem,
        });
        bresult = bresult.dataValues;
        litem[key.toLowerCase()] = bresult.id;
      }
      bi += 1;
    }
    delete litem.id;
    delete litem.createdAt;
    delete litem.updatedAt;
    await item.create(litem);
    li += 1;
  }
  result.lastTime = date;
  appendFile(`${lpath}/${type}.json`, JSON.stringify(result), { flag: 'w' });
  return result;
}
export async function restoreDatas({ date }) {
  try {
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
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据列表
 */
export async function backups() {
  try {
    let list = getFiles(BACKUP_DIR);
    console.log(list);
    list = list.map((v) => {
      const arrs = v.split('.');
      if (arrs.length > 1) {
        arrs.pop();
      }
      return arrs.join('.');
    });

    return new SuccessModel(list);
  } catch (error) {
    return catchError(error);
  }
}
