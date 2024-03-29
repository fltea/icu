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
      comment: '指针开始',
    },
    source: {
      type: STRING,
      comment: '原文',
    },
    article: {
      type: INTEGER,
      comment: '文章',
    },
    record: {
      type: INTEGER,
      comment: '文章',
    },
  },
  belongsTo: {
    Article: 'article',
    Record: 'record',
  },
};

export default Note;
