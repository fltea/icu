import request from '../utils/axios';

const url = '/api/douban';

export const durl = (data) => request({
  url: `${url}/durl`,
  method: 'post',
  data,
});
export const durlDetail = (data) => request({
  url: `${url}/durl/detail`,
  method: 'post',
  data,
});

export const doulist = (data) => request({
  url: `${url}/doulist`,
  method: 'get',
  data,
});
export const doulistId = (id) => request({
  url: `${url}/doulist/${id}`,
  method: 'get',
});
export const doulistAdd = (data) => request({
  url: `${url}/doulist/add`,
  method: 'post',
  data,
});
export const doulistMod = (data) => request({
  url: `${url}/doulist/modify`,
  method: 'post',
  data,
});

export const group = (data) => request({
  url: `${url}/group`,
  method: 'get',
  data,
});
export const groupId = (id) => request({
  url: `${url}/group/${id}`,
  method: 'get',
});
export const groupAdd = (data) => request({
  url: `${url}/group/add`,
  method: 'post',
  data,
});
export const groupMod = (data) => request({
  url: `${url}/group/modify`,
  method: 'post',
  data,
});
export const doubanDel = (data) => request({
  url: `${url}/del`,
  method: 'post',
  data,
});
