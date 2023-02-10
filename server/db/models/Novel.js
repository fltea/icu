import { TEXT, INTEGER, STRING, BOOLEAN } from '../types.js';

const Novel = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      comment: '地址',
    },
    clutter: {
      type: INTEGER,
      allowNull: false,
      comment: 'Clutter Id',
    },
    title: {
      type: STRING,
      comment: '书名',
    },
    author: {
      type: STRING,
      comment: '作者',
    },
    origin: {
      type: STRING,
      comment: '首发主页',
    },
    finish: {
      type: BOOLEAN,
      comment: '已完结',
    },
    content: {
      type: TEXT,
      comment: '内容简介',
    },
    loaded: {
      type: INTEGER,
      comment: '已下载章节数量',
    },
  },
  belongsTo: {
    Clutter: 'clutter',
  },
  hasMany: {
    Chapter: 'novel',
  },
};

export default Novel;
