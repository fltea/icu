import request from '../utils/axios';

const url = '/api/douban';

export const doulist = (data) => request({
  url: `${url}/doulist`,
  method: 'post',
  data,
});

export const dDoulist = (id) => request({
  url: `${url}/doulist/${id}`,
  method: 'post',
});
export const dArticles = (data) => request({
  url: `${url}/doulist/articles`,
  method: 'post',
  data,
});

export const details = (data) => request({
  url: `${url}/details`,
  method: 'post',
  data,
});

export const save = (data) => request({
  url: `${url}/save`,
  method: 'post',
  data,
});
