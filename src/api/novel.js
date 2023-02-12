import request from '../utils/axios';
import { urlStringify } from '../utils/tools';

const url = '/api/novel';

export const list = (data) => request({
  url: `${url}?${urlStringify(data)}`,
  method: 'get',
});

export const detail = (data) => request({
  url: `${url}/detail`,
  method: 'post',
  data,
});
export const dChapters = (data) => request({
  url: `${url}/detail/chapters`,
  method: 'post',
  data,
});
export const dChapter = (data) => request({
  url: `${url}/detail/chapter`,
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
