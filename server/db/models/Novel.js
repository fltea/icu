import { TEXT, INTEGER, STRING } from '../types.js';

const Novel = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    author: {
      type: STRING,
      allowNull: false,
      comment: '作者',
    },
    title: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    clutter: {
      type: INTEGER,
      allowNull: false,
      comment: '',
    },
    name: {
      type: STRING,
      comment: '书名',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
  },
  belongsTo: {
    Clutter: 'clutter',
  },
};

export default Novel;
