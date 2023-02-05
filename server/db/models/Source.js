import { STRING, TEXT, DATE } from '../types.js';

const Source = {
  model: {
    basic: {
      type: TEXT,
      comment: '原始数据',
    },
    basicId: {
      type: STRING,
      comment: '原始Id',
    },
    plaform: {
      type: STRING,
      comment: '来源平台',
    },
    link: {
      type: STRING,
      comment: '来源链接',
    },
    author: {
      type: STRING,
      comment: '作者',
    },
    authorId: {
      type: STRING,
      comment: '作者Id',
    },
    authorLink: {
      type: STRING,
      comment: '作者链接',
    },
    authorLocation: {
      type: STRING,
      comment: '作者地址',
    },
    publishTime: {
      type: DATE,
      comment: '发表日期',
    },
  },
  hasOne: {
    Blog: 'source',
    Article: 'source',
    Video: 'source',
  },
  hasMany: {
    PicTie: 'source',
  },
};

export default Source;
