import { TEXT, INTEGER, STRING } from '../types.js';

const Note = {
  model: {
    content: {
      type: TEXT,
      allowNull: false,
      comment: '内容',
    },
    position: {
      type: INTEGER,
      comment: '指针开始位置',
    },
    source: {
      type: STRING,
      comment: '原文',
    },
    article: {
      type: INTEGER,
      comment: '文章',
    },
  },
  belongsTo: {
    Article: 'article',
  },
};

export default Note;
