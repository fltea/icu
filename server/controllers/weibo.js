import { addInfo, errorInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import { WEIBO_CONF } from '../conf/constant.js';
import catchError from '../utils/tcatch.js';
import { formatDate, sleep } from '../utils/tools.js';
import { downSource } from '../utils/files.js';

import {
  homes,
  follows,
  favorites,
  weiboDetail,
  weiboInfo,
  weiboComment,
  userList,
  weiboArticle,
  weiboArticleP,
} from '../services/weibo.js';

import {
  sourceAdd,
} from '../services/source.js';
import {
  picAdd,
  // picBulk,
} from '../services/pic.js';
import {
  videoAdd,
  // picBulk,
} from '../services/video.js';

/**
 * 獲取home列表
 */
export async function getHomes({ maxId, cookie }) {
  try {
    const result = await homes(cookie, maxId);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取follow列表
 */
export async function getFollows({ page, cookie }) {
  try {
    const result = await follows(cookie, page);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取favorite列表
 */
export async function getFavorites({ page, cookie }) {
  try {
    const result = await favorites(cookie, page);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取詳情數據
 */
export async function getDetail({ id, cookie }) {
  try {
    if (id) {
      const result = await weiboDetail(cookie, id);
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}
export async function getWiebo({ id, cookie }) {
  try {
    if (id) {
      const result = await weiboInfo(cookie, id);
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取評論列表
 */
export async function getComments({ id, cookie }) {
  try {
    if (id) {
      const result = await weiboComment(cookie, id);
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取列表
 */
export async function getUsers({ uid, sinceId }) {
  try {
    const result = await userList(uid, sinceId);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 保存source
 */
export async function createSource(weibo) {
  try {
    // console.log(weibo);
    const basic = JSON.stringify(weibo);
    const basicId = weibo.id;
    const { pics, page_info: pageInfo, user } = weibo;
    const link = WEIBO_CONF.detail.replace('{id}', basicId);
    const author = user.screen_name;
    const authorId = user.id;
    const authorLink = WEIBO_CONF.userLink.replace('{id}', authorId);
    const publishTime = formatDate({
      date: weibo.created_at,
    });
    const source = { basic, basicId, plaform: 'weibo', link, author, authorId, authorLink, publishTime };
    // console.log(source);
    const result = await sourceAdd(source);
    // 圖片
    if (pics) {
      console.log('pics', pics);
      let index = 0;
      const len = pics.length;
      while (index < len) {
        const { url } = pics[index].large;
        const name = url.split('/').pop();
        const downResult = await downSource(url, name, 'https://weibo.com/');
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
    if (pageInfo) {
      // 文章
      console.log('pageInfo', pageInfo);
      // 視頻
      if (pageInfo.type === 'video') {
        const { mp4_ld_mp4: url, url_ori: urlOri, title, content2: text } = pageInfo.urls;
        const name = url.split('?').shift().split('/').pop();
        const downResult = await downSource(url, name);
        if (downResult) {
          const video = await videoAdd({
            title,
            text,
            url: name,
            link: urlOri,
          });
          console.log(video);
        }
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

/**
 * 獲取文章
 */
export async function getArticles({ id, type }) {
  try {
    if (id) {
      let result;
      if (type) {
        result = await weiboArticleP(id);
      } else {
        result = await weiboArticle(id);
      }
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}
