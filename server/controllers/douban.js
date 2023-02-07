import { schemaFileInfo, addInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { formatDate, sleep } from '../utils/tools.js';
import { downSource } from '../utils/files.js';

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

/**
 * 獲取 doulist
 */
export async function getDoulist({ id, page }) {
  try {
    if (id) {
      const result = await doulist(id, page);
      if (result) {
        return new SuccessModel(result);
      }
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
