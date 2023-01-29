import { TEXT, INTEGER, STRING } from '../types.js';

const Novel = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    title: {
      type: STRING,
      comment: '',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
    noveler: {
      type: INTEGER,
      comment: '',
    },
  },
  belongsTo: {
    Noveler: 'noveler',
  },
};

export default Novel;
