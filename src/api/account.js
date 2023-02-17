import request from '../utils/axios';

const url = '/api/account';

export const upload = (data) => request({
  url: `${url}/upload`,
  method: 'post',
  data,
});

export const list = (data) => request({
  url: `${url}`,
  method: 'get',
  data,
});

export const detail = (data) => request({
  url: `${url}/detail`,
  method: 'post',
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

export const del = (data) => request({
  url: `${url}/delete`,
  method: 'post',
  data,
});

// tied
export const tied = (data) => request({
  url: `${url}/tied`,
  method: 'post',
  data,
});

export const tiedMod = (data) => request({
  url: `${url}/tied/modify`,
  method: 'post',
  data,
});
