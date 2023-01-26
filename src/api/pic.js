import request from '../utils/axios';

const url = '/api/pic';

export const list = () => request({
  url: `${url}`,
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
  url: `${url}/delete`,
  method: 'post',
  data,
});
