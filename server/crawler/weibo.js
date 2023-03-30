import hparser from 'node-html-parser';
import request from '../utils/request.js';
import { WEIBO_CONF } from '../conf/constant.js';
import { getHeader, getData } from '../utils/crawler.js';

/**
 * 獲取home列表
 */
export async function homes(cookie, maxId) {
  const result = {};
  let list = await request({
    url: `${WEIBO_CONF.home}${maxId ? `?max_id=${maxId}` : ''}`,
    header: getHeader(cookie),
    method: 'GET',
  });
  list = getData(list);
  if (list.ok) {
    result.list = list.data.statuses;
    result.count = list.data.total_number;
  } else {
    result.error = list;
  }
  // console.log(list);
  return result;
}

/**
 * 獲取follow列表
 */
export async function follows(cookie, page) {
  const result = {};
  let url = WEIBO_CONF.follow;
  if (page > 1) {
    url += `&page=${page}`;
  }
  let data = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
    // console.log(data);
  data = getData(data);
  if (data.ok) {
    data = data.data || {};
    const { cards = [] } = data;
    let users = [];
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        // 用戶
        if (card.card_type === 11) {
          const { card_group: list } = card;
          users = list.filter((v) => v.card_type === 10).map((v) => v.user);
        }
        // 結束
        if (card.card_type === 58) {
          result.finished = true;
        }
      });
    }

    result.list = users;
  } else {
    result.error = data;
  }
  return result;
}

/**
 * 獲取favorite列表
 */
export async function favorites(cookie, page) {
  const result = {};
  let url = WEIBO_CONF.favorite;
  if (page > 1) {
    url += `&page=${page}`;
  }
  let data = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
  data = getData(data);
  if (data.ok) {
    data = data.data || {};
    const { cards = [] } = data;
    const list = cards.filter((v) => v.card_type === 9).map((v) => v.mblog);
    result.list = list;
  } else {
    result.error = data;
  }
  return result;
}

/**
 * 獲取詳情數據
 */
export async function weiboDetail(cookie, id) {
  const result = {};
  let data = await request({
    url: WEIBO_CONF.detailS.replace(/\{id}/g, id),
    header: getHeader(cookie),
    method: 'GET',
  });
  data = getData(data);
  if (data.ok) {
    data = data.data || {};
    // console.log(data);
    result.data = data;
  } else {
    result.error = data;
  }
  return result;
}
export async function weiboInfo(cookie, id) {
  const result = {};
  let data = await request({
    url: WEIBO_CONF.detailE.replace(/\{id}/g, id),
    header: getHeader(cookie),
    method: 'GET',
  });
  data = getData(data);
  if (data.ok) {
    data = data.data || {};
    // console.log(data);
    result.detail = data.longTextContent;
    result.comments_count = data.comments_count;
  } else {
    result.error = data;
  }
  return result;
}

/**
 * 獲取評論列表
 */
export async function weiboComment(cookie, id) {
  const result = {};
  let data = await request({
    url: WEIBO_CONF.comment.replace(/\{id}/g, id),
    header: getHeader(cookie, WEIBO_CONF.detail.replace(/\{id}/g, id)),
    method: 'GET',
  });
  data = getData(data);
  if (data.ok) {
    data = data.data || {};
    result.list = data.data || [];
  } else {
    result.error = data;
  }
  return result;
}

/**
 * 用戶微博列表
 * @param {*} uid
 * @param {*} sinceId
 */
export async function weiboUsers({ id, sinceId, cookie }) {
  // console.log('userList', uid, sinceId);
  const result = {};
  let url = WEIBO_CONF.userList.replace(/\{id}/g, id);
  if (sinceId) {
    url += `&since_id=${sinceId}`;
  }
  let data = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
  data = getData(data);
  // console.log('userList data', data);
  if (data.ok) {
    data = data.data || {};
    const { cards = [], cardlistInfo = {} } = data;
    const list = [];
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        // 微博
        if (card.card_type === 9) {
          list.push(card.mblog);
        }
      });
      // 結束
      if (!cards.length) {
        result.finished = true;
      }
    }

    result.list = list;
    result.sinceId = cardlistInfo.since_id || '';
  } else {
    result.error = data;
  }
  return result;
}

/**
 * 微博文章
 * @param {string} url 文章 url
 * @returns
 */
export async function weiboArticles(url) {
  const result = {
    url,
  };
  const html = await request({
    url,
    header: getHeader('PC_TOKEN=8291d10cbb; SUB=_2AkMTeHNNf8NxqwJRmP4RzG3iaIxxyQnEieKlJIKWJRMxHRl-yT9vqnwptRB6OPhdoX_AZH8US0seREcYIe8eBmnUVryj; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9W566Bc9IOn.E7hH1kxalCY9', 'https://weibo.com/'),
    method: 'GET',
  });
  if (html) {
    // console.log(html);
    const root = hparser.parse(html);
    const main = root.querySelector('.main_editor');
    // 标题
    let info = main.querySelector('.title');
    // console.log('标题', info.text);
    result.title = info.text;
    // 作者
    info = root.querySelector('.authorinfo a');
    const uid = info.getAttribute('href').replace('/u/', '');
    // console.log('作者 Id', uid);
    // console.log('作者', info.text);
    result.authorId = uid;
    result.author = info.text;
    // preface_v2
    info = main.querySelector('.preface_v2');
    // console.log('preface_v2',info.text);
    if (info) {
      result.preface = info.innerHTML;
    }
    // 圖片
    info = main.querySelectorAll('figure.image');
    // console.log('內容', info.innerHTML);
    const pics = [];
    info.forEach((v) => {
      const strs = v.innerHTML.split(/\s/);
      let text = strs.filter((str) => str.includes('http')).pop();
      if (text.includes('=')) {
        text = text.split('"').filter((str) => str.includes('http')).pop();
      }
      pics.push(text);
      const img = strs.shift();
      const imgs = strs.slice(-3);
      imgs.unshift(img, `src="${text}"`);
      v.innerHTML = imgs.join(' ');
    });
    result.pics = pics;
    // 內容
    info = main.querySelector('.WB_editor_iframe_new');
    // console.log('內容', info.innerHTML);
    result.content = (result.preface || '') + info.innerHTML;
  }
  // console.log(result);
  return result;
}
