import request from '../utils/axios';

const url = '/api/weibo';

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
