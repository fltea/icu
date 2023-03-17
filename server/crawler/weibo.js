import hparser from 'node-html-parser';
import request from '../utils/request.js';
import { UserAgent, WEIBO_CONF } from '../conf/constant.js';
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

export async function weiboArticle(id) {
  const result = {};
  try {
    const header = {
      authority: 'weibo.com',
      'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      'sec-ch-ua-mobile': '?0',
      'user-agent': UserAgent,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-dest': 'document',
      'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8',
      referer: 'https://weibo.com/',
      cookie: 'PC_TOKEN=f059159c29; SUB=_2AkMUh9RNf8NxqwJRmP4RzG3iaIxxyQnEieKi2yWWJRMxHRl-yT9kqm4vtRB6Pwf6oX6eecPFh8B7_s47tpiNZ3bgSiVn; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9W566Bc9IOn.E7hH1kxalCY9; WBStorage=4d96c54e|undefined; _s_tentry=passport.weibo.com; Apache=9914572583203.178.1675320187624; SINAGLOBAL=9914572583203.178.1675320187624; ULV=1675320187640:1:1:1:9914572583203.178.1675320187624:',
    };
    const html = await request({
      url: WEIBO_CONF.article.replace(/\{id}/g, id),
      header,
      method: 'GET',
    });
    // console.log('html', html);
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
    result.preface = info.text;
    // // 內容
    info = main.querySelector('.WB_editor_iframe_new');
    // console.log('內容', info.innerHTML);
    result.content = info.innerHTML;
  } catch (error) {
    // console.log('error', error);
    result.error = error;
  }
  return result;
}

export async function weiboArticleP(pid) {
  const result = {};
  try {
    const url = WEIBO_CONF.articleP.replace(/\{pid}/g, pid);
    const header = {
      authority: 'weibo.com',
      'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      'sec-ch-ua-mobile': '?0',
      'user-agent': UserAgent,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-dest': 'document',
      'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8',
      referer: 'https://weibo.com/',
      cookie: 'PC_TOKEN=df8f4bf804; SUB=_2AkMUh70of8NxqwJRmfwXxWrhb4V0zQDEieKi20zzJRMxHRl-yT92qkgQtRB6PweTxwZfmUbVqEUfr0NoMpjCt9-aGPjp; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WWIVAlkAMPjNbdL2W8Wk3XK',
    };
    const article = await request({
      url,
      header,
      method: 'GET',
    });
    // console.log('data', article);
    let html = article.match(/FM.view\(({"ns":"pl.content.longFeed.index.*})\)/);
    if (html && html[1]) {
      html = JSON.parse(html[1]);
      // console.log('html.html', html.html);
      const root = hparser.parse(html.html);
      // 标题
      let info = root.querySelector('.title');
      // console.log('标题', info);
      result.title = info.text;
      // 時間
      info = root.querySelector('.info .time');
      // console.log('時間', info.text);
      result.time = info.text;
      // 作者 Id
      info = article.match(/uid.+?;/);
      if (info[0]) {
        let uid = info[0];
        info = uid.match(/\d+/);
        if (info[0]) {
          uid = info.pop();
          result.authorId = uid;
        }
      }
      // 作者
      info = article.match(/W_autocut.+?title=.?"(.+?)\\/);
      // console.log('作者', info.text);
      result.author = info && info[1];
      // // preface_v2
      // info = root.querySelector('.preface_v2');
      // // console.log('preface_v2',info.text);
      // result.preface = info.text;
      // 內容
      // info = root.querySelector('.WBA_content');
      // console.log('內容',info.innerHTML);
      result.content = html.html;
    }
    // console.log('result', result);
  } catch (error) {
    // console.log('error', error);
    result.error = error;
  }
  return result;
}
