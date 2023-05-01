import { TEXT, INTEGER, STRING } from '../types.js';

/**
 * 小说： 章节
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
      comment: 'clutter ID',
    },
    media: {
      type: INTEGER,
      comment: 'Media ID',
    },
    serial: {
      type: INTEGER,
      comment: '序号',
    },
    author: {
      type: STRING,
      comment: '作者',
    },
    platform: {
      type: STRING,
      comment: '平台',
    },
  },
  belongsTo: {
    Clutter: 'clutter',
    Media: 'media',
  },
};

export default Chapter;
