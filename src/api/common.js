import request from '../utils/axios';

let url = '/api/common';

export const upload = (data) => request({
  url: `${url}/upload`,
  method: 'post',
  data,
});

// 数据备份
export const backups = () => request({
  url: `${url}/backups`,
  method: 'get',
});

export const backup = () => request({
  url: `${url}/backup`,
  method: 'post',
});

export const restore = (data) => request({
  url: `${url}/restore`,
  method: 'post',
  data,
});

// clutter
url = '/api/clutter';
export const clutters = () => request({
  url: `${url}`,
  method: 'get',
});

export const addClutter = (data) => request({
  url: `${url}/add`,
  method: 'post',
  data,
});

export const modClutter = (data) => request({
  url: `${url}/modify`,
  method: 'post',
  data,
});
export const delClutter = (data) => request({
  url: `${url}/delete`,
  method: 'post',
  data,
});
