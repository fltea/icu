import { addInfo, errorInfo, notExistInfo, updateInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { renameFile, downSource } from '../utils/files.js';

import {
  homes,
  follows,
  favorites,
  weiboDetail,
  weiboInfo,
  weiboComment,
  weiboUsers,
  weiboArticles,
} from '../crawler/weibo.js';

import { newRecord, recordInfo, records } from '../services/record.js';
import { WEIBO_CONF } from '../conf/constant.js';
import { deepCopy } from '../utils/tools.js';
import { findORCreateMedia } from '../services/media.js';
import { changeClutter, clutterInfo, newClutter, clutters } from '../services/clutter.js';

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
    const result = await weiboDetail(cookie, id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}
export async function getWiebo({ id, cookie }) {
  try {
    const result = await weiboInfo(cookie, id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取評論列表
 */
export async function getComment({ id, cookie }) {
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
export async function getUsers({ id, sinceId, cookie }) {
  try {
    const result = await weiboUsers({ id, sinceId, cookie });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 獲取文章
 */
export async function getArticles({ url }) {
  try {
    const result = await weiboArticles(url);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(errorInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取微博屏蔽
 */
const blockType = 'weiboBlock';
export async function getBlock() {
  try {
    const result = await clutterInfo({
      type: blockType,
      phrase: '',
    });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 保存微博屏蔽
 */
export async function setBlock({ id, content }) {
  try {
    const clutter = {
      type: blockType,
      content,
      id,
    };
    let result;
    if (id) {
      result = await changeClutter(clutter);
    } else {
      result = await newClutter(clutter);
    }
    if (result) {
      delete result.type;
      return new SuccessModel(result);
    }
    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取用户
 */
const userType = 'weiboUser';
export async function getUser({ ids }) {
  try {
    const result = await clutters({
      type: userType,
      page: 0,
      ids,
    });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 保存用户
 */
export async function setUser(user) {
  try {
    const clutter = {
      type: userType,
      phrase: user.id,
      content: JSON.stringify(user),
    };
    const result = await newClutter(clutter);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 用户详情
 */
export async function User({ name }) {
  try {
    const result = await clutters({
      type: userType,
      content: name,
    });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取微博
 */
export async function getRecord({ title, content, type, author, platform, tag, page, limit }) {
  try {
    const result = await records({ title, content, type, author, platform, tag, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 保存微博
 */
// 删除多余数据
function formatData(data) {
  const datakeys = ['created_at', 'mid', 'text', 'raw_text', 'user', 'region_name', 'retweeted_status', 'pics', 'page_info'];
  const userkeys = ['id', 'screen_name', 'profile_url', 'profile_image_url', 'description'];
  Object.keys(data).forEach((key) => {
    if (!datakeys.includes(key)) {
      delete data[key];
    }
  });
  Object.keys(data.user).forEach((key) => {
    if (!userkeys.includes(key)) {
      delete data.user[key];
    }
  });

  if (data.retweeted_status) {
    formatData(data.retweeted_status);
  }
}

// 微博详情
function detail2Record(data) {
  const { created_at: publishTime, mid, text, user, region_name: region } = data;
  const { screen_name: author, id, profile_url: authorLink } = user;
  const authorIp = region ? region.split(' ').pop() : '';
  const url = WEIBO_CONF.detail.replace('{id}', mid);
  const infos = deepCopy(data);
  formatData(infos);
  const record = {
    url,
    type: 'weiboDetail',
    typeId: mid,
    author,
    authorId: id,
    authorLink,
    authorIp,
    platform: 'weibo',
    publishTime: new Date(publishTime),
    content: text,
    infos,
  };
  return { record, infos };
}

// 下載圖片
async function downLoadMedias(url, type) {
  const name = url.split('?').shift().split('/').pop();
  const item = await downSource(url, name, 'https://m.weibo.cn');
  if (item) {
    const newPath = item.replace('files', 'files/media');
    renameFile(item, newPath);
    const result = await findORCreateMedia({
      type: type || name.split('.').pop(),
      title: name,
      url: `/${newPath}`,
      origin: url,
    });
    return { type: result.type, title: result.title, url: result.url, origin: result.origin };
  }
  return null;
}

export async function setRecord({ weibo }) {
  try {
    const data = JSON.parse(weibo);
    // 微博内容
    const values = detail2Record(data);

    const { record, infos } = values;
    const { pics, page_info: minfos } = infos;
    // console.log(record);
    // 图片
    if (pics && pics.length) {
      // const picList = pics.map((v) => v.large.url);
      let max = pics.length - 1;
      while (max >= 0) {
        const pic = pics[max];
        const { url } = pic.large;
        const item = await downLoadMedias(url);
        if (item) {
          pics[max] = item;
        }
        max -= 1;
      }
    }
    // 有其他內容
    if (minfos) {
      // 视频
      if (minfos.type === 'video') {
        const { mp4_720p_mp4: url } = minfos.urls;
        const item = await downLoadMedias(url, minfos.type);
        if (item) {
          infos.page_info = item;
        }
      } else if (minfos.type === 'article') {
        const { title, content, pics: vpics } = await weiboArticles(minfos.page_url);
        let max = vpics.length - 1;
        while (max >= 0) {
          const url = vpics[max];
          const item = await downLoadMedias(url);
          if (item) {
            content.replace(url, item.url);
          }
          max -= 1;
        }
        record.type = 'weiboArticle';
        record.title = title;
        record.content = content;
        delete record.infos;
      }
    }
    if (record.infos) {
      record.infos = JSON.stringify(infos);
    }

    // console.log('record', record);
    if (record) {
      const result = await newRecord(record);
      if (result) {
        return new SuccessModel(result);
      }
    }

    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 微博详情
 */
export async function Record({ id }) {
  try {
    const result = await recordInfo(+id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}
