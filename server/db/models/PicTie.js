import { TEXT, BOOLEAN, INTEGER } from '../types.js';

const PicTie = {
  model: {
    pic: {
      type: INTEGER,
      allowNull: false,
      comment: 'pic id',
    },
    isCover: {
      type: BOOLEAN,
      comment: '是否是封面',
    },
    article: {
      type: INTEGER,
      comment: 'Article ID',
    },
    blog: {
      type: INTEGER,
      comment: 'Blog ID',
    },
    book: {
      type: INTEGER,
      comment: 'Book ID',
    },
    means: {
      type: INTEGER,
      comment: 'Means ID',
    },
    source: {
      type: INTEGER,
      comment: 'Source ID',
    },
    video: {
      type: INTEGER,
      comment: 'Video ID',
    },
    todo: {
      type: INTEGER,
      comment: 'todo ID',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
  belongsTo: {
    Pic: 'pic',
    Article: 'article',
    Blog: 'blog',
    Book: 'book',
    Means: 'means',
    Source: 'source',
    Todo: 'todo',
    Video: 'video',
  },
};

export default PicTie;
