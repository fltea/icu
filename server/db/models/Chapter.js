import { TEXT, INTEGER, STRING } from '../types.js';

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
    author: {
      type: STRING,
      comment: '作者',
    },
  },
  belongsTo: {
    Novel: 'novel',
  },
};

export default Chapter;
