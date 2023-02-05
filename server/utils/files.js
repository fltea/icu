import fs from 'node:fs';

import { FILE_DIR, LOG_DIR, UserAgent } from '../conf/constant.js';
import { formatDate } from './tools.js';
import request from './request.js';

/**
 *
 * @param {string} path 文件路径
 * @param {string} data 文件内容
 * @param {object} options 文件配置
 */
export function appendFile(path, data, options = {}) {
  fs.appendFileSync(path, data, options);
}

export function setLog(name, data) {
  const date = formatDate({
    format: 'YYYY-mm-dd',
  });
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  appendFile(`${LOG_DIR}/${name}${date}.txt`, `${formatDate({})}\n${data}\n`);
}

/**
 *
 * @param {string} filePath
 * @returns
 */
export function reqiureFile(filePath) {
  try {
    const result = fs.readFileSync(filePath);
    return result;
  } catch (error) {
    setLog('', error);
    return null;
  }
}

export function statDir(dpath) {
  try {
    fs.statSync(dpath);
  } catch (error) {
    // console.log('error', error);
    fs.mkdirSync(dpath, { recursive: true });
  }
}

export async function downSource(url, name, referer) {
  try {
    const options = {
      url,
      header: {
        'User-Agent': UserAgent,
      },
      method: 'GET',
      media: true,
    };
    if (referer) {
      options.header.referer = referer;
    }
    const source = await request(options);
    const npath = `${FILE_DIR}/${name}`;
    appendFile(npath, source, {
      encoding: 'binary',
      flag: 'w',
    });
    // console.log(npath, url);
    return npath;
  } catch (error) {
    throw new Error(error);
  }
}

export function getFiles(fpath) {
  const result = fs.readdirSync(fpath);
  return result;
}
