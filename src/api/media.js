import request from '../utils/axios';

const url = '/api/media';

export const list = (data) => request({
  url,
  method: 'get',
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

export const del = (data) => request({
  url: `${url}/del`,
  method: 'post',
  data,
});
