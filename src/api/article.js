import request from '../utils/axios';

const url = '/api/article';

export const list = (data) => request({
  url,
  method: 'get',
  data,
});

export const add = (data) => request({
  url: `${url}/add`,
  method: 'post',
  data,
});

export const modify = (data) => request({
  url: `${url}/modify`,
  method: 'post',
  data,
});

export const upload = (data) => request({
  url: `${url}/upload`,
  method: 'post',
  data,
});

export const detail = (id) => request({
  url: `${url}/${id}`,
  method: 'get',
});
