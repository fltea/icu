import request from '../utils/axios';

const url = '/api/common';

export const upload = (data) => request({
  url: `${url}/upload`,
  method: 'post',
  data,
});
