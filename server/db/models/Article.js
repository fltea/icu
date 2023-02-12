import { STRING, DATEONLY, INTEGER, TEXT, FLOAT } from '../types.js';

const Article = {
  model: {
    title: {
      type: STRING,
      allowNull: false,
      comment: '标题',
    },
    tag: {
      type: STRING,
      comment: '标签',
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: '内容',
    },
    author: {
      type: STRING,
      comment: '作者',
    },
    translator: {
      type: STRING,
      comment: '译者',
    },
    link: {
      type: STRING,
      comment: '原文链接',
    },
    platform: {
      type: STRING,
      comment: '原文平台',
    },
    links: {
      type: STRING,
      comment: '相关链接',
    },
    publish: {
      type: STRING,
      comment: '出版方',
    },
    price: {
      type: FLOAT,
      comment: '定价',
    },
    publishDate: {
      type: DATEONLY,
      comment: '发表日期',
    },
    todo: {
      type: INTEGER,
      comment: '目标ID',
    },
    book: {
      type: INTEGER,
      comment: '书Id',
    },
    cover: {
      type: INTEGER,
      comment: 'Pic Id',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
    clutter: {
      type: INTEGER,
      comment: 'Clutter Id',
    },
  },
  belongsTo: {
    Todo: 'todo',
    Book: 'book',
    Clutter: 'clutter',
  },
  hasMany: {
    Video: 'article',
    PicTie: 'article',
  },
};

export default Article;
