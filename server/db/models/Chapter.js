import { TEXT, INTEGER, STRING, DATE } from '../types.js';

/**
 * 小说： 章节
 * 豆瓣： 广播 日记 小组 讨论
 * 微博： 微博 文章
 */
const Chapter = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '地址',
    },
    title: {
      type: STRING,
      allowNull: false,
      comment: '标题',
    },
    novel: {
      type: INTEGER,
      allowNull: false,
      comment: 'Novel Id',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
    clutter: {
      type: INTEGER,
      allowNull: false,
      comment: 'clutter Id',
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
    authorIp: {
      type: STRING,
      comment: '作者地址',
    },
    platform: {
      type: STRING,
      comment: '平台',
    },
    platformId: {
      type: STRING,
      comment: '原始Id',
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
    Novel: 'novel',
    Clutter: 'clutter',
  },
};

export default Chapter;
