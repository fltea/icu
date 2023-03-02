import hparser from 'node-html-parser';
import request from '../utils/request.js';
import { getHeader, getAttrs, getText, getList } from '../utils/crawler.js';

// 无权限
function getWrapper(root, selector = '#wrapper ul') {
  const wrapper = root.querySelector(selector);
  return getText(wrapper);
}
// 获取ID
function getId(url) {
  const murl = url.split('?').shift();
  const result = murl.split('/').filter((v) => !!v);
  if (result && result.length > 1) {
    return result.pop();
  }
  return '';
}

// 书影音
// 短评
function getEnComments(root) {
  const item = {};
  getAttrs(root, {
    // 用户
    author: '.comment-info a',
    // 用户连接
    authorLink: ['.comment-info a', 'href'],
    // 时间
    createTime: '.comment-info .comment-time',
  }, item);
  // 内容
  let dom = root.querySelector('.comment-content .full');
  if (!dom) {
    dom = root.querySelector('.comment-content .short');
  }
  item.content = getText(dom, 'innerHTML');

  // 评分
  dom = root.querySelector('.comment-info .rating');
  if (dom) {
    const rate = dom.classList.value.join('').replace(/[^\d]/g, '');
    item.rate = rate;
  }

  return item;
}
// 长评
function getEnRComments(root) {
  const item = {};
  getAttrs(root, {
    // 用户
    author: 'header .name',
    // 用户连接
    authorLink: [' header .name', 'href'],
    // 时间
    createTime: '.main-meta',
    title: 'h2 a',
    // 连接
    titleLink: ['h2 a', 'href'],
  }, item);
  // 内容
  let dom = root.querySelector('.short-content');
  dom.querySelector('a').remove();
  item.content = getText(dom, 'innerHTML');

  // 评分
  dom = root.querySelector('.main-title-rating');
  if (dom) {
    const rate = dom.classList.value.join('').replace(/[^\d]/g, '');
    item.rate = rate;
  }

  return item;
}

// 日记广播 评论
function getComments(text) {
  const start = text.indexOf("'comments':");
  const end = text.indexOf("'total':");
  const value = text.substring(start + 12, end - 1);
  if (value) {
    return JSON.parse(value);
  }

  return null;
}

// 小组讨论 评论
function getGComments(root) {
  // console.log(root);
  const item = {};

  // 用户信息
  let info = root.querySelector('a');
  item.userName = getText(info);
  item.userLink = info.getAttribute('href');
  info = root.querySelector('.pubtime');
  info = getText(info);
  info = info.split(' ');
  item.userIp = info.pop();
  item.time = info.join(' ');
  // 图片
  info = root.querySelector('.comment-photos img');
  if (info) {
    item.img = info.getAttribute('src');
  }
  // 内容
  info = root.querySelector('.reply-content');
  if (info) {
    item.content = info.innerHTML;
  }
  // 回复
  info = root.querySelector('.reply-quote');
  if (info) {
    const reply = {};
    // 图片
    let dom = info.querySelector('.comment-photos img');
    if (dom) {
      reply.img = dom.getAttribute('src');
    }
    // 内容
    dom = info.querySelector('.all.ref-content');
    if (dom) {
      reply.content = dom.innerHTML;
    }
    // 用户
    dom = info.querySelector('.pubdate a');
    if (dom) {
      reply.userName = getText(dom);
      reply.userLink = dom.getAttribute('href');
    }
    item.reply = reply;
  }
  const imgs = root.querySelectorAll('img');
  if (imgs) {
    item.imgs = imgs.map((img) => img.getAttribute('src'));
  }
  return item;
}

// 小组讨论
const gtArg = {
  // 标题
  title: 'h1',
  // 作者
  author: '.topic-doc a',
  // 作者连接
  authorLink: ['.topic-doc a', 'href'],
  // 作者地址
  authorIp: '.topic-doc .create-ip',
  // 时间
  createTime: '.topic-doc .create-time',
};
function getGroupTopic(root) {
  const result = {};
  const article = root.querySelector('.topic-richtext');
  if (!article) {
    result.content = getWrapper(root);
  } else {
    getAttrs(root, gtArg, result);
    // 内容
    result.content = getText(article, 'innerHTML');

    const imgs = article.querySelectorAll('img');
    if (imgs) {
      result.imgs = imgs.map((img) => img.getAttribute('src'));
    }
    // 最赞回应
    let pcomments = root.querySelector('#popular-comments .reply-doc');
    if (pcomments) {
      pcomments = pcomments.map(getGComments);
      result.pcomments = pcomments;
    }
    // 评论
    let comments = root.querySelectorAll('#comments .reply-doc');
    if (comments) {
      comments = comments.map(getGComments);
      result.comments = comments;
    }
  }
  return result;
}

// 日记
const nArg = {
  // 标题
  title: '.note-header h1',
  // 作者
  author: '.aside .content a',
  // 作者连接
  authorLink: ['.aside .content a', 'href'],
  // 作者地址
  authorIp: '.aside .content .usercard-loc',
  // 时间
  createTime: '.note-header .pub-date',
};
function getNote(root) {
  const result = {};
  const article = root.querySelector('#link-report');
  if (!article) {
    result.content = getWrapper(root);
  } else {
    getAttrs(root, nArg, result);
    // 内容
    let dom = article.querySelector('.note');
    result.content = getText(dom, 'innerHTML');

    const imgs = dom.querySelectorAll('img');
    if (imgs) {
      result.imgs = imgs.map((img) => img.getAttribute('src'));
    }

    // 标签
    dom = article.querySelectorAll('.mod-tags a');
    if (dom) {
      result.tags = getList(dom);
    }

    // 评论
    const comments = root.querySelector('#comments + script');
    const text = getText(comments);
    const value = getComments(text);
    if (value) {
      result.comments = value;
    }
  }
  return result;
}

// 广播
const sArg = {
  // 标题
  title: 'h1',
  // 作者
  author: '.text .lnk-people',
  // 作者连接
  authorLink: ['.text .lnk-people', 'href'],
  // 作者地址
  authorIp: '.text .pubtime .pub-loc',
  // 时间
  createTime: '.text .pubtime span',
  topic: '.topic-say a',
  topicLink: ['.topic-say a', 'href'],
};
function getStatus(root) {
  const result = {};
  const article = root.querySelector('#content .status-item');
  if (!article) {
    result.content = getWrapper(root);
  } else {
    getAttrs(article, sArg, result);
    // 内容
    const content = article.querySelector('blockquote');
    result.content = getText(content, 'innerHTML');
    // 转发内容
    const repost = root.querySelector('.status-real-wrapper');
    if (repost) {
      const item = {};
      getAttrs(repost, sArg, item);
      item.url = repost.getAttribute('data-status-url');
      const dom = repost.querySelector('.quote-clamp');
      item.content = getText(dom, 'innerHTML');
      // 图片
      const imgs = repost.querySelectorAll('.pics-wrapper img');
      if (imgs) {
        item.imgs = imgs.map((img) => img.getAttribute('src'));
      }
      result.repost = item;
    }

    // 分享
    const share = article.querySelector('.bd .block');
    if (share) {
      const item = {};
      getAttrs(article, {
        // 标题
        share: '.text a:nth-last-of-type(1)',
        shareLink: ['.text a:nth-last-of-type(1)', 'href'],
      }, item);
      getAttrs(share, {
        // 标题
        title: '.title a',
        titleLink: ['.title a', 'href'],
      }, item);
      const dom = share.querySelector('.content p');
      item.content = getText(dom, 'innerHTML');
      // 图片
      const imgs = share.querySelectorAll('.pic img');
      if (imgs) {
        item.imgs = imgs.map((img) => img.getAttribute('src'));
      }
      result.share = item;
    }

    // 图片
    const imgs = article.querySelectorAll('.pics-wrapper img');
    if (imgs) {
      result.imgs = imgs.map((img) => img.getAttribute('src'));
    }

    // 评论
    const comments = root.querySelector('#comments + script');
    const text = getText(comments);
    const value = getComments(text);
    if (value) {
      result.comments = value;
    }
  }
  return result;
}

// 书影音
const enArg = {
  // 标题
  title: 'h1 span',
  year: 'h1 .year',
};
function getEntertainment(root) {
  const result = {};
  const article = root.querySelector('#content');
  if (!article) {
    result.content = getWrapper(root);
  } else {
    getAttrs(root, enArg, result);
    // 封面
    const img = article.querySelector('#mainpic');
    result.img = img.getAttribute('src');

    // 基本信息
    let dom = article.querySelector('#info');
    result.info = getText(dom, 'innerHTML');

    // 评分
    dom = article.querySelector('#interest_sectl .rating_num');
    if (dom) {
      result.rate = getText(dom);
    }
    dom = article.querySelector('#interest_sectl .rating_sum');
    if (dom) {
      result.rateStr = getText(dom);
    }

    // 内容
    dom = article.querySelector('#link-report-intra');
    if (!dom) {
      dom = article.querySelector('#link-report .all');
      if (!dom) {
        dom = article.querySelector('#link-report span');
      } else {
        dom = dom.querySelector('.intro');
      }
    } else {
      dom = dom.querySelector('span');
    }
    result.content = getText(dom, 'innerHTML');

    // 评论
    // 短评
    let comments = root.querySelectorAll('#comments-section .comment-item');
    if (comments) {
      comments = comments.map(getEnComments);
      result.comments = comments;
    }

    // 长评
    comments = root.querySelectorAll('#reviews-wrapper .review-item');
    if (comments) {
      comments = comments.map(getEnRComments);
      result.reviews = comments;
    }
  }
  return result;
}

/**
 * 根据 url 获取所有豆列
 */
export async function durlist(url, cookie) {
  const html = await request({
    url,
    header: getHeader({ cookie }),
    method: 'GET',
  });

  const result = {
    url,
  };
  const root = hparser.parse(html);
  const listCom = root.querySelector('.doulist-list');
  if (!listCom) {
    result.content = getWrapper(root, '.out');
    return result;
  }
  const list = root.querySelectorAll('.doulist-list h3 a');
  result.list = list.map((v) => ({
    name: v.text,
    link: v.getAttribute('href'),
  }));
  let nextPage = root.querySelector('.next a');
  if (!nextPage) {
    nextPage = root.querySelector('.switch_tabs a');
  }
  if (nextPage) {
    nextPage = nextPage.getAttribute('href');
    if (nextPage.charAt(0) === '?') {
      result.nextPage = url + nextPage;
    } else if (nextPage.charAt(0) === '/') {
      result.nextPage = `https://www.douban.com${nextPage}`;
    } else {
      const urls = url.split('/');
      urls.pop();
      result.nextPage = `${urls.join('/')}/${nextPage}`;
    }
  }
  result.type = 'doulist';
  result.url = url;
  return result;
}

/**
 * 获取豆列详情
 */
export async function durl(url, cookie) {
  const html = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
  // console.log(html);
  const result = {
    url,
  };
  const root = hparser.parse(html);
  const content = root.querySelector('#content');
  if (!content) {
    result.content = getWrapper(root);
    return result;
  }
  // 标题
  let dom = content.querySelector('h1');
  if (dom) {
    result.title = dom.text.replace(/\r?\n?\s+?/g, '');
  }
  // 作者信息
  dom = content.querySelector('#doulist-info .meta a');
  if (dom) {
    let text = dom.text.replace(/\r?\n?\s+?/g, '');
    text = text.split('(');
    result.aurthor = text.shift();
    result.aurthorIp = text.shift().replace(')', '');
    result.aurthorLink = dom.getAttribute('href');
  }
  // 数量总计
  dom = content.querySelector('.doulist-filter a');
  if (dom) {
    let text = dom.text.replace(/\r?\n?\s+?/g, '');
    text = text.split('(');
    result.count = +text.pop().replace(')', '');
  }
  // 创建更新时间
  dom = content.querySelector('#doulist-info .meta .time');
  if (dom) {
    const text = dom.text.split(/\r?\n?\s+?/).filter((v) => !!v).map((v) => v.replace(/[^\d:]/g, ''));
    result.createTime = text.slice(0, 2).join(' ');
    result.updateTime = text.slice(-2).join(' ');
  }
  // 内容
  dom = content.querySelector('#doulist-info .doulist-about');
  if (dom) {
    let dcontent = dom.innerHTML;
    dcontent = dcontent.replace(/&nbsp;/g, '');
    dcontent = dcontent.replace(/\r?\n?\s+?/g, '');
    result.content = dcontent;
  }
  // 列表
  const list = content.querySelectorAll('.doulist-item');
  result.list = list.map((v) => {
    let item;
    let text;
    let a = v.querySelector('.title a');
    if (a) {
      text = v.querySelector('.abstract');
    } else {
      text = v.querySelector('.status-content');
      if (text) {
        a = text.querySelector('a');
      }
    }
    if (a) {
      const link = a.getAttribute('href');
      const source = v.querySelector('.source');
      item = {
        title: getText(a),
        url: link,
        text: getText(text, 'innerHTML'),
        source: getText(source).split('：').pop(),
      };
      const comment = v.querySelector('.comment-item');
      if (comment) {
        item.comment = getText(comment);
      }
    } else {
      text = v.querySelector('.bd');
      item = {
        text: getText(text, 'innerHTML'),
      };
    }
    return item;
  });
  // console.log(list.length);
  const nextPage = content.querySelector('.next a');
  if (nextPage) {
    result.nextPage = nextPage.getAttribute('href');
  }
  result.type = 'doulist-detail';
  result.url = url;
  result.id = getId(url);
  return result;
}

/**
 * 根据 url 获取所有小组
 */
export async function gurlist(url, cookie) {
  const html = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
  // console.log(html);
  const result = {
    url,
  };

  const root = hparser.parse(html);
  const listCom = root.querySelector('.group-list');
  if (!listCom) {
    result.content = getWrapper(root);
    return result;
  }
  const dom = root.querySelectorAll('.group-cards .title a');
  if (dom) {
    result.list = getList(dom);
  }

  result.type = 'group';
  result.url = url;
  return result;
}

/**
 * 获取小组详情
 */
export async function gurl(url, cookie) {
  const html = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
  const result = {
    url,
  };
  const root = hparser.parse(html);
  const listCom = root.querySelector('#group-topics');
  if (!listCom) {
    result.content = getWrapper(root);
    return result;
  }
  // 小组信息
  // 组名
  let dom = root.querySelector('#group-info h1');
  if (dom) {
    result.name = getText(dom);
  }
  // 小组信息
  dom = root.querySelector('.group-info-item.group-loc');
  if (dom) {
    result.info = getText(dom, 'innerHTML');
  }
  dom = root.querySelector('.group-info-item.group-intro');
  if (dom) {
    result.content = getText(dom, 'innerHTML');
  }
  // 发言规则
  dom = root.querySelector('.group-info-item.group-rules');
  if (dom) {
    result.rules = getText(dom, 'innerHTML');
  }
  // 标签
  dom = root.querySelectorAll('.group-tags a');
  if (dom) {
    result.tags = getList(dom);
  }

  // 讨论
  dom = root.querySelectorAll('.topic-tab a');
  if (dom) {
    result.tabs = getList(dom);
  }

  dom = root.querySelectorAll('#group-topics tr');
  if (dom) {
    result.topics = dom.map((tr) => {
      const item = {};
      const tds = tr.querySelectorAll('td');
      let idom = tds.shift();
      item.title = getText(idom);
      idom = idom.querySelector('a');
      if (idom) {
        item.url = idom.getAttribute('href');
      }
      idom = tds.shift();
      idom = idom.querySelector('a');
      item.author = getText(idom);
      if (idom) {
        item.authorLink = idom.getAttribute('href');
      }
      idom = tds.shift();
      item.count = +getText(idom);
      idom = tds.shift();
      item.updateTime = getText(idom);
      return item;
    });
  }

  result.type = 'group-detail';
  result.url = url;
  result.id = getId(url);
  return result;
}

/**
 * 获取详情
 */
export async function dDetail(url, cookie) {
  const html = await request({
    url,
    header: getHeader(cookie),
    method: 'GET',
  });
  const root = hparser.parse(html);
  let result = {};

  if (url.includes('/group/topic')) {
    // 小组讨论
    result = getGroupTopic(root);
    result.type = 'group-topic';
  } else if (url.includes('/note/')) {
    // 日记
    result = getNote(root);
    result.type = 'note';
  } else if (url.includes('/status/')) {
    // 广播
    result = getStatus(root);
    result.type = 'status';
  } else if (!url.includes('www.douban.com')) {
  // 书影音
    result = getEntertainment(root);
    result.type = 'entertainment';
  }

  result.url = url;
  result.id = getId(url);
  return result;
}
