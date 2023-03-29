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
  weiboArticle,
  weiboArticleP,
} from '../crawler/weibo.js';

import {
  picAdd,
  // picBulk,
} from '../services/pic.js';
import {
  videoAdd,
  // picBulk,
} from '../services/video.js';

import { blockAdd, blockList, blockMod, userAdd, userList } from '../services/weibo.js';
import { newRecord, recordInfo, records } from '../services/record.js';
import { WEIBO_CONF } from '../conf/constant.js';
import { deepCopy } from '../utils/tools.js';
import { newMedia } from '../services/media.js';

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
 * 保存source
 */
export async function createSource(weibo) {
  try {
    // console.log(weibo);
    // const basic = JSON.stringify(weibo);
    // const basicId = weibo.id;
    const { pics, page_info: pageInfo } = weibo;
    // const link = WEIBO_CONF.detail.replace('{id}', basicId);
    // const author = user.screen_name;
    // const authorId = user.id;
    // const authorLink = WEIBO_CONF.userLink.replace('{id}', authorId);
    // const publishTime = formatDate({
    //   date: weibo.created_at,
    // });
    // const source = { basic, basicId, plaform: 'weibo', link, author, authorId, authorLink, publishTime };
    // console.log(source);
    const result = {};
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
        // await sleep(3000);
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

/**
 * 获取微博屏蔽
 */
export async function getBlock() {
  try {
    const result = await blockList();
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
    let result;
    if (id) {
      result = await blockMod(id, content);
    } else {
      result = await blockAdd(content);
    }
    if (result) {
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
export async function getUser({ ids }) {
  try {
    const result = await userList(ids);
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
    const result = await userAdd(user);
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
export async function User() {
  try {
    const result = 'await userList({ id, sinceId, cookie })';
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
  formatData(data);
  const infos = deepCopy(data);
  const record = {
    url,
    type: 'weibodetail',
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
// 微博文章
function article2Record(data) {
  console.log(data);
  return {};
}
export async function setRecord({ weibo }) {
  try {
    const data = JSON.parse(weibo);
    const { page_info: info } = data;
    let values;

    if (info && info.type === 'article') {
      // 文章
      values = article2Record(data);
    } else {
      // 微博内容
      values = detail2Record(data);
    }

    const { record, infos } = values;
    const { pics, page_info: video } = infos;
    // console.log(record);
    // 图片
    if (pics && pics.length) {
      // const picList = pics.map((v) => v.large.url);
      let max = pics.length - 1;
      while (max >= 0) {
        const pic = pics[max];
        const { url } = pic.large;
        const name = pic.url.split('/').pop();
        const item = await downSource(url, name, 'https://m.weibo.cn');
        const newPath = item.replace('files', 'files/media');
        renameFile(item, newPath);

        const media = await newMedia({
          type: name.split('.').pop(),
          title: name,
          url: `/${newPath}`,
        });
        if (media) {
          const { url: murl, title, id } = media.dataValues;
          pics[max] = { url: murl, nurl: url, title, id };
        }
        max -= 1;
      }
    }
    // 视频
    if (video && video.type === 'video') {
      const { mp4_720p_mp4: url } = video.urls;
      const name = url.split('?').shift().split('/').pop();
      const item = await downSource(url, name, 'https://m.weibo.cn');
      const newPath = item.replace('files', 'files/media');
      renameFile(item, newPath);

      const media = await newMedia({
        type: name.split('.').pop(),
        title: name,
        url: `/${newPath}`,
      });
      if (media) {
        const { url: murl, title, id } = media.dataValues;
        infos.page_info = { url: murl, nurl: url, title, id, type: video.type };
      }
    }
    // console.log('record', record, pics, infos);
    record.infos = JSON.stringify(infos);

    const result = await newRecord(record);
    if (result) {
      return new SuccessModel(result);
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
