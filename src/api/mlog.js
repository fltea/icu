import request from '../utils/axios';

const url = '/api/mlog';

export const list = (data) => request({
  url: `${url}`,
  method: 'get',
  data,
});

export const add = (data) => request({
  url: `${url}/add`,
  method: 'post',
  data,
});
