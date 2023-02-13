import request from '../utils/axios';

const url = '/api/common';

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
const clutter = '/api/clutter';
export const clutters = (data) => request({
  url: clutter,
  method: 'get',
  data,
});

export const addClutter = (data) => request({
  url: `${clutter}/add`,
  method: 'post',
  data,
});

export const modClutter = (data) => request({
  url: `${clutter}/modify`,
  method: 'post',
  data,
});
export const delClutter = (data) => request({
  url: `${clutter}/delete`,
  method: 'post',
  data,
});
