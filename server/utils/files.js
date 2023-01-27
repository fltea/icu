import fs from 'node:fs';

import { LOG_DIR } from '../conf/constant.js';
import { formatDate } from './tools.js';

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
