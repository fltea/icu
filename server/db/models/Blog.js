import { STRING, INTEGER, TEXT } from '../types.js';

const Blog = {
  model: {
    text: {
      type: TEXT,
      allowNull: false,
      comment: '内容',
    },
    link: {
      type: STRING,
      comment: '外部链接',
    },
    creator: {
      type: STRING,
      comment: '创建者',
    },
    source: {
      type: INTEGER,
      comment: '关联SourceID',
    },
    remark: {
      type: STRING,
      comment: '备注',
    },
  },
  belongsTo: {
    Source: 'source',
  },
  hasMany: {
    Pic: 'blog',
  },
  hasOne: {
    Video: 'blog',
  },
};

export default Blog;
