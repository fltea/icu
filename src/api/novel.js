import request from '../utils/axios';

const url = '/api/novel';

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

export const content = (data) => request({
  url: `${url}/content`,
  method: 'post',
  data,
});

export const chapter = (data) => request({
  url: `${url}/chapter`,
  method: 'post',
  data,
});
