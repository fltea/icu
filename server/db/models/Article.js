import { STRING, DATEONLY, TEXT } from '../types.js';

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
    publishDate: {
      type: DATEONLY,
      comment: '发表日期',
    },
    cover: {
      type: STRING,
      comment: '图片地址',
    },
  },
};

export default Article;
