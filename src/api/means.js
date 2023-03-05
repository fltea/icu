import request from '../utils/axios';

const url = '/api/means';

export const meansList = (data) => request({
  url: `${url}`,
  method: 'get',
  data,
});

export const meansAdd = (data) => request({
  url: `${url}/add`,
  method: 'post',
  data,
});

export const meansMod = (data) => request({
  url: `${url}/modify`,
  method: 'post',
  data,
});

export const meansDel = (data) => request({
  url: `${url}/delete`,
  method: 'post',
  data,
});
