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
    content: {
      type: TEXT,
      comment: '内容',
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
      type: INTEGER,
      comment: 'Chapter ID',
    },
    serial: {
      type: INTEGER,
      comment: '序号',
    },
    aurthor: {
      type: STRING,
      comment: '作者',
    },
    aurthorId: {
      type: STRING,
      comment: '作者Id',
    },
    aurthorLink: {
      type: STRING,
      comment: '作者链接',
    },
    aurthorIp: {
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
    Clutter: 'clutter',
    Chapter: 'typeId',
  },
};

export default Chapter;
