import request from '../utils/axios';

const url = '/api/common';

export const upload = (data) => request({
  url: `${url}/upload`,
  method: 'post',
  data,
});

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
