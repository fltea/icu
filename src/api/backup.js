import request from '../utils/axios';

const url = '/api/backup';

// 数据备份
export const backup = (data) => request({
  url: `${url}/`,
  method: 'post',
  data,
});

export const backups = () => request({
  url: `${url}/backups`,
  method: 'get',
});

export const restore = (data) => request({
  url: `${url}/restore`,
  method: 'post',
  data,
});
