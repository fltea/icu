import request from '../utils/axios';

const url = '/api/novel';

export const nurl = (data) => request({
  url: `${url}/nurl`,
  method: 'post',
  data,
});

export const nurlchapter = (data) => request({
  url: `${url}/nurl/chapter`,
  method: 'post',
  data,
});

export const list = (data) => request({
  url,
  method: 'get',
  data,
});

export const detail = (data) => request({
  url: `${url}/detail`,
  method: 'post',
  data,
});

export const novelAdd = (data) => request({
  url: `${url}/add`,
  method: 'post',
  data,
});

export const novelMod = (data) => request({
  url: `${url}/modify`,
  method: 'post',
  data,
});

export const novelDel = (data) => request({
  url: `${url}/del`,
  method: 'post',
  data,
});

export const noveler = (data) => request({
  url: `${url}/noveler`,
  method: 'post',
  data,
});

export const chapter = (data) => request({
  url: `${url}/chapter`,
  method: 'post',
  data,
});

export const chapterAdd = (data) => request({
  url: `${url}/chapter/add`,
  method: 'post',
  data,
});

export const chapterMod = (data) => request({
  url: `${url}/chapter/modify`,
  method: 'post',
  data,
});

export const chapterSort = (data) => request({
  url: `${url}/chapter/sort`,
  method: 'post',
  data,
});
