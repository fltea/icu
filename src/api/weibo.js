import request from '../utils/axios';

const url = '/api/weibo';

// 微博數據接口
export const whome = (data) => request({
  url: `${url}/whome`,
  method: 'post',
  data,
});

export const wfollow = (data) => request({
  url: `${url}/wfollow`,
  method: 'post',
  data,
});

export const wfavorite = (data) => request({
  url: `${url}/wfavorite`,
  method: 'post',
  data,
});

export const wdetail = (data) => request({
  url: `${url}/wdetail`,
  method: 'post',
  data,
});
export const winfo = (data) => request({
  url: `${url}/winfo`,
  method: 'post',
  data,
});
export const wcomment = (data) => request({
  url: `${url}/wcomment`,
  method: 'post',
  data,
});

export const wuser = (data) => request({
  url: `${url}/wuser`,
  method: 'post',
  data,
});

export const warticle = (data) => request({
  url: `${url}/warticle`,
  method: 'post',
  data,
});

export const block = () => request({
  url: `${url}/block`,
  method: 'get',
});

export const saveBlock = (data) => request({
  url: `${url}/block/save`,
  method: 'post',
  data,
});

export const user = (data) => request({
  url: `${url}/user`,
  method: 'get',
  data,
});

export const userSave = (data) => request({
  url: `${url}/user/save`,
  method: 'post',
  data,
});
export const userDetail = (id) => request({
  url: `${url}/user/${id}`,
  method: 'get',
});

export const record = (data) => request({
  url: `${url}/record`,
  method: 'get',
  data,
});

export const recordSave = (data) => request({
  url: `${url}/record/save`,
  method: 'post',
  data,
});
export const recordDetail = (id) => request({
  url: `${url}/record/${id}`,
  method: 'get',
});

export const save = (data) => request({
  url: `${url}/record/save`,
  method: 'post',
  data,
});
