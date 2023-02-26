import request from '../utils/axios';

const url = '/api/douban';

export const durl = (data) => request({
  url: `${url}/durl`,
  method: 'post',
  data,
});
export const detail = (data) => request({
  url: `${url}/detail`,
  method: 'post',
  data,
});
export const doulist = (data) => request({
  url: `${url}/doulist`,
  method: 'get',
  data,
});
export const dAdd = (data) => request({
  url: `${url}/doulist/add`,
  method: 'post',
  data,
});
export const dMod = (data) => request({
  url: `${url}/doulist/modify`,
  method: 'post',
  data,
});
export const dList = (data) => request({
  url: `${url}/doulist/list`,
  method: 'post',
  data,
});

export const gurl = (data) => request({
  url: `${url}/gurl`,
  method: 'post',
  data,
});
export const group = (data) => request({
  url: `${url}/group`,
  method: 'get',
  data,
});
export const gAdd = (data) => request({
  url: `${url}/group/add`,
  method: 'post',
  data,
});
export const gMod = (data) => request({
  url: `${url}/group/modify`,
  method: 'post',
  data,
});
export const gList = (data) => request({
  url: `${url}/group/list`,
  method: 'post',
  data,
});

export const details = (data) => request({
  url: `${url}/details`,
  method: 'post',
  data,
});

export const save = (data) => request({
  url: `${url}/save`,
  method: 'post',
  data,
});
