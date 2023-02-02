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

/**
 *
 * @param {string} filePath
 * @returns
 */
export function reqiureFile(filePath) {
  let result;
  try {
    result = fs.readFileSync(filePath);
  } catch (error) {
    console.error(error.message);
  }
  return result;
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

export async function downSource(url, name, referer) {
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
}
