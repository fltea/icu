import request from '../utils/axios';

const url = '/api/douban';

export const doulist = (data) => request({
  url: `${url}/doulist`,
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

export const modify = (data) => request({
  url: `${url}/modify`,
  method: 'post',
  data,
});

export const del = (data) => request({
  url: `${url}/delete`,
  method: 'post',
  data,
});
