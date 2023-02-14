import { notExistInfo, nodataInfo } from '../model/ErrorInfos.js';
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
  return list;
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
      if (result.length) {
        appendFile(`${lpath}/${key}.json`, JSON.stringify(result), { flag: 'w' });
      }
    }

    return new SuccessModel();
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据 还原
 */
export async function restoreDatas({ date }) {
  try {
    let Datas = reqiureFile(`${BACKUP_DIR}/${date}.json`);
    if (!Datas) {
      return new ErrorModel(notExistInfo);
    }
    Datas = JSON.parse(Datas);
    const keys = Object.keys(Datas);
    if (!keys.length) {
      return new ErrorModel(nodataInfo);
    }

    // 根据模型 belongsTo 确定顺序
    const list = [];
    const max = keys.length;
    for (let i = 0; i < max; i++) {
      const key = keys[i];
      if (!list.includes(key)) {
        list.push(key);
      }
      let item = await import(`../db/model/${key}.js`);
      item = item.default;
      console.log('item', item);
      const { belongsTo } = item;
      if (belongsTo) {
        const index = list.findIndex((v) => v === key);
        const ins = Object.keys(belongsTo);
        ins.forEach((v) => {
          if (list.includes(v)) {
            const vdex = list.findIndex((vd) => vd === v);
            if (vdex > index) {
              list.splice(vdex, 1);
              list.splice(index, 0, v);
            }
          } else {
            list.splice(index, 0, v);
          }
        });
      }
    }
    console.log(list);

    // 多数据插入
    let i = 0;
    const len = list.length;
    for (; i < len; i++) {
      const key = list[i];
      const item = models[key];
      const dataes = Datas[key];
      if (dataes) {
        let maxLen = dataes.length;
        while (maxLen > 0) {
          const datas = dataes.splice(0, 100);
          await item.bulkCreate(datas, { ignoreDuplicates: true });
          maxLen = dataes.length;
        }
      }
    }

    return new SuccessModel({
      message: `数据已还原到${date}`,
    });
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
    list = list.map((v) => {
      const arrs = v.split('.');
      arrs.pop();
      return arrs.join('.');
    });

    return new SuccessModel(list);
  } catch (error) {
    return catchError(error);
  }
}
