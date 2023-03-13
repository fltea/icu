import fs from 'node:fs';
import zlib from 'node:zlib';

import { FILE_DIR, LOG_DIR, TEMP_DIR, COOKIES_DIR, UserAgent } from '../conf/constant.js';
import { formatDate } from './tools.js';
import hash from './crypto.js';
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
    setLog('error', error);
    return null;
  }
}

export function statDir(dpath) {
  try {
    fs.statSync(dpath);
  } catch (error) {
    setLog('error', error);
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

export function hashBrFile(path, name, data) {
  const fileId = hash(name);
  if (data) {
    const buffer = zlib.brotliCompressSync(data);
    appendFile(`${path}/${fileId}`, buffer, { flag: 'w' });
  } else {
    const text = reqiureFile(`${path}/${fileId}`);
    if (text) {
      return zlib.brotliDecompressSync(text);
    }
  }
  return null;
}

// 暂存list在服务器
export function setHashList(name, list) {
  const listId = hash(name);
  if (!Array.isArray(list)) {
    list = [list];
  }
  appendFile(`${TEMP_DIR}/${listId}`, JSON.stringify(list), { flag: 'w' });
}

// 从服务器获取list
export function getHashList(name) {
  const listId = hash(name);
  const list = reqiureFile(`${TEMP_DIR}/${listId}`);
  return list ? JSON.parse(list) : list;
}

export function toogleCookies(name, cookies) {
  // 确保文件夹存在
  statDir(COOKIES_DIR);
  if (!name) {
    throw new Error('name is not define');
  }

  let result = '';
  const path = `${COOKIES_DIR}/${name}`;

  if (cookies) {
    result = cookies;
    if (typeof cookies !== 'object') {
      result = {
        cookies,
      };
    }
    appendFile(path, JSON.stringify(result), { flag: 'w' });
  } else {
    result = reqiureFile(path);
    if (result) {
      result = JSON.parse(result);
    }
  }
  return result;
}
