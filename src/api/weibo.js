import request from '../utils/axios';

const url = '/api/weibo';

// 微博數據接口
export const whome = (data) => request({
  url: `${url}/whome`,
  method: 'post',
  data,
});

export const wfollow = (data) => request({
  url: `${url}/wfollow`,
  method: 'post',
  data,
});

export const wfavorite = (data) => request({
  url: `${url}/wfavorite`,
  method: 'post',
  data,
});

export const wdetail = (data) => request({
  url: `${url}/wdetail`,
  method: 'post',
  data,
});
export const wcomment = (data) => request({
  url: `${url}/wcomment`,
  method: 'post',
  data,
});

export const warticle = (data) => request({
  url: `${url}/warticle`,
  method: 'post',
  data,
});

export const homelist = (data) => request({
  url: `${url}`,
  method: 'post',
  data,
});

export const follows = (data) => request({
  url: `${url}/follows`,
  method: 'post',
  data,
});
export const userlist = (data) => request({
  url: `${url}/userlist`,
  method: 'post',
  data,
});

export const save = (data) => request({
  url: `${url}/save`,
  method: 'post',
  data,
});

export const detail = (data) => request({
  url: `${url}/detail`,
  method: 'post',
  data,
});

export const comments = (data) => request({
  url: `${url}/comments`,
  method: 'post',
  data,
});

export const articles = (data) => request({
  url: `${url}/articles`,
  method: 'post',
  data,
});
