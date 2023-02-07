import hparser from 'node-html-parser';
import { UserAgent, DOUBAN_CONF } from '../conf/constant.js';
import request from '../utils/request.js';

function getComment(element) {
  const item = {};
  let info = element.querySelector('a');
  item.userName = info.text;
  item.userLink = info.getAttribute('href');
  info = element.querySelector('.pubtime');
  info = info.text.split(' ');
  item.origin = info.pop();
  item.time = info.join(' ');
  // reply-quote
  info = element.querySelector('.reply-quote');
  if (info) {
    item.reply = info.innerHTML;
  }
  // comment-photos
  info = element.querySelector('.comment-photos img');
  if (info) {
    item.img = info.getAttribute('src');
  }
  info = element.querySelector('.reply-content');
  item.content = info.innerHTML;
  return item;
}

function getGroupTopic(root) {
  const result = {};
  try {
    // 标题
    let info = root.querySelector('h1') || {};
    result.title = info.text || '';
    // 作者
    info = root.querySelector('.topic-doc a') || {};
    result.author = info.text || '';
    // 作者连接
    result.authorLink = info.getAttribute('href') || '';
    // 时间
    info = root.querySelector('.topic-doc .create-time') || {};
    result.time = info.text || '';
    // 地址
    info = root.querySelector('.topic-doc .create-ip') || {};
    result.origin = info.text || '';

    const article = root.querySelector('#content .article') || {};
    // 内容
    const content = article.querySelector('.topic-richtext') || {};
    result.content = content.innerHTML || '';

    const imgs = content.querySelectorAll('img');
    if (imgs) {
      result.imgs = imgs.map((img) => img.getAttribute('src'));
    }
    // 最赞回应
    let pcomments = article.querySelector('#popular-comments .reply-doc');
    if (pcomments) {
      pcomments = pcomments.map(getComment);
      result.pcomments = pcomments;
    }
    // 评论
    let comments = article.querySelectorAll('#comments .reply-doc') || [];
    comments = comments.map(getComment);
    result.comments = comments;
  } catch (error) {
    result.error = error;
  }
  return result;
}

function getNote(root) {
  const result = {};
  try {
    // 标题
    let info = root.querySelector('h1') || {};
    result.title = info.text || '';
    // 作者
    info = root.querySelector('.note-header .note-author') || {};
    result.author = info.text || '';
    // 作者连接
    result.authorLink = info.getAttribute('href') || '';
    // 时间
    info = root.querySelector('.note-header .pub-date') || {};
    result.time = info.text || '';

    const article = root.querySelector('#link-report') || {};
    // tags
    info = article.querySelectorAll('.mod-tags a');
    if (info) {
      result.tags = info.map((v) => v.text);
    }
    // 内容
    const content = article.querySelector('.note') || {};
    result.content = content.innerHTML || '';

    const imgs = content.querySelectorAll('img');
    if (imgs) {
      result.imgs = imgs.map((img) => img.getAttribute('src'));
    }
    // 评论
    let html = root.toString();
    html = html.match(/comments.:\s(\[{.+}\]),\s+.+total/);
    // console.log(html && html[1]);
    if (html && html[1]) {
      const comments = JSON.parse(html[1]) || [];
      // console.log(comments);
      result.comments = comments;
    }
  } catch (error) {
    result.error = error;
  }
  return result;
}
function getStatus(root) {
  const result = {};
  try {
    // 标题
    let info = root.querySelector('h1') || {};
    result.title = info.text || '';
    // 作者
    info = root.querySelector('.note-header .note-author') || {};
    result.author = info.text || '';
    // 作者连接
    result.authorLink = info.getAttribute('href') || '';
    // 时间
    info = root.querySelector('.note-header .pubtime') || {};
    result.time = info.text || '';

    const article = root.querySelector('#content .article') || {};
    // 内容
    const content = article.querySelector('.topic-richtext') || {};
    result.content = content.innerHTML || '';
    // 最赞回应
    let pcomments = article.querySelector('#popular-comments .reply-doc');
    if (pcomments) {
      pcomments = pcomments.map(getComment);
      result.pcomments = pcomments;
    }
    // 评论
    let comments = article.querySelectorAll('#comments .reply-doc') || [];
    comments = comments.map(getComment);
    result.comments = comments;
  } catch (error) {
    result.error = error;
  }
  return result;
}

export async function doulist(id, page) {
  const result = {};
  try {
    let url = DOUBAN_CONF.list.replace(/{id}/g, id);
    if (page > 1) {
      url += `?start=${(page - 1) * 25}&sort=time&playable=0&sub_type=`;
    }
    const html = await request({
      url,
      header: {
        'User-Agent': UserAgent,
      // cookie: wcookie,
      },
      method: 'GET',
    });
    // console.log(html);
    const root = hparser.parse(html);
    let pageList = root.querySelectorAll('.doulist-item[id]');
    pageList = pageList.map((p) => {
      let text;
      let a = p.querySelector('.title a');
      if (a) {
        text = p.querySelector('.abstract');
      } else {
        text = p.querySelector('.status-content');
        a = text.querySelector('a');
      }
      const link = a.getAttribute('href');
      return {
        id: p.getAttribute('id'),
        title: a.text.replace(/\r?\n?\s+?/g, ''),
        url: link,
        text: text.text.replace(/\r?\n?\s+?/g, ''),
      };
    });
    // console.log(pageList);
    result.list = pageList;
  } catch (error) {
    result.error = error;
  }

  return result;
}

export async function details(url) {
  let result = {};
  try {
    const html = await request({
      url,
      header: {
        'User-Agent': UserAgent,
      },
      method: 'GET',
      // console.log(html);
    });
    const root = hparser.parse(html);
    // 区分 小组讨论 日记 书影音 广播
    // const types = {
    //   '/group/topic': '.topic-richtext',
    //   '/note/': '.note-container',
    //   '/status/': '.status-item',
    // };
    // .subjectwrap
    // const isMedia = url.includes('.douban.com');
    const isGroup = url.includes('/group/topic');
    const isNote = url.includes('/note/');
    const isStatus = url.includes('/status/');
    if (isGroup) {
      const topic = getGroupTopic(root);
      result = Object.assign(result, topic);
    }

    if (isNote) {
      const note = getNote(root);
      result = Object.assign(result, note);
    }
    if (isStatus) {
      const status = getStatus(root);
      result = Object.assign(result, status);
    }
  } catch (error) {
    result.error = error;
  }

  return result;
}
