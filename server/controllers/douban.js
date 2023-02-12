import { schemaFileInfo, addInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { formatDate, sleep } from '../utils/tools.js';
import { downSource, appendFile, reqiureFile } from '../utils/files.js';
import { TEMP_DIR } from '../conf/constant.js';
import hash from '../utils/crypto.js';

import {
  doulist,
  details,
} from '../services/douban.js';

import {
  sourceAdd,
} from '../services/source.js';
import {
  picAdd,
  // picBulk,
} from '../services/pic.js';
import {
  clutterInfo,
} from '../services/clutter.js';
import {
  articleBulk,
} from '../services/article.js';

/**
 * 獲取 doulist
 */
export async function getDoulist({ id, page, nolist }) {
  try {
    if (id) {
      const result = await doulist(id, page);
      if (result) {
        // 暂存list在服务器
        const tempId = hash(`doulist${id}`);
        appendFile(`${TEMP_DIR}/${tempId}`, JSON.stringify(result.pages), { flag: 'w' });

        if (nolist) {
          delete result.pages;
        }

        return new SuccessModel(result);
      }
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 批量豆列文章
 */
export async function saveDoulistList({ id, clutter }) {
  try {
    if (id) {
      const listId = hash(`doulist${id}`);
      let list = reqiureFile(`${TEMP_DIR}/${listId}`);
      list = JSON.parse(list).map((v) => ({
        link: v.url,
        title: v.title,
        clutter: +clutter,
        content: '',
        platform: 'douban',
      }));
      list = await articleBulk(list);
      return new SuccessModel(list);
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取豆列所有文章
 */
export async function getDoulistList(id) {
  try {
    if (id) {
      // 根据id 获取 clutter
      // console.log(id);
      const item = {
        type: 'doulist',
        phrase: id,
      };
      const result = await clutterInfo(item);
      return new SuccessModel(result);
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function getDetails({ url }) {
  try {
    if (url) {
      const result = await details(url);
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 保存source
 */
export async function createSource(douban) {
  try {
    const basic = JSON.stringify(douban);
    const basicId = douban.id;
    const { author, authorId, authorLink, time, origin, imgs, comments, link } = douban;
    const publishTime = formatDate({
      date: time,
    });
    const source = { basic, basicId, plaform: 'douban', link, author, authorId, authorLink, authorIp: origin, publishTime };
    const result = await sourceAdd(source);
    console.log('comments', comments);
    // 圖片
    if (imgs) {
      // console.log('imgs', imgs);
      let index = 0;
      const len = imgs.length;
      while (index < len) {
        const url = imgs[index];
        const name = url.split('/').pop();
        const downResult = await downSource(url, name, 'https://www.douban.com/');
        if (downResult) {
          const pic = await picAdd({
            url: name,
            link: url,
          });
          console.log(pic);
        }
        index += 1;
        await sleep(3000);
      }
    }

    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}
