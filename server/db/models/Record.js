import { TEXT, INTEGER, STRING, DATE } from '../types.js';

/**
 * 豆瓣： 广播 日记 小组 讨论
 * 微博： 微博 文章
 */
const Record = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '地址',
    },
    title: {
      type: STRING,
      comment: '标题',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
    infos: {
      type: TEXT,
      comment: '更多内容',
    },
    clutter: {
      type: INTEGER,
      comment: 'clutter Id',
    },
    type: {
      type: STRING,
      comment: 'type',
    },
    typeId: {
      type: STRING,
      comment: 'type',
      unique: 'type',
    },
    author: {
      type: STRING,
      comment: '作者',
    },
    authorDesc: {
      type: STRING,
      comment: '作者描述',
    },
    authorLink: {
      type: STRING,
      comment: '作者链接',
    },
    authorIp: {
      type: STRING,
      comment: '作者地址',
    },
    platform: {
      type: STRING,
      comment: '平台',
    },
    publishTime: {
      type: DATE,
      comment: '发表日期',
    },
    tag: {
      type: STRING,
      comment: '标签',
    },
  },
  belongsTo: {
    Clutter: 'clutter',
  },
};

export default Record;
