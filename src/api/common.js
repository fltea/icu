import request from '../utils/axios';

const url = '/api/common';

export const getOptions = () => request({
  url: `${url}/getOptions`,
  method: 'get',
});

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

export const backup = (data) => request({
  url: `${url}/backup`,
  method: 'post',
  data,
});

export const restore = (data) => request({
  url: `${url}/restore`,
  method: 'post',
  data,
});
