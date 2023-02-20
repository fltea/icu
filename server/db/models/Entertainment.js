import { STRING, INTEGER, TEXT, DATEONLY, FLOAT } from '../types.js';

const Entertainment = {
  model: {
    title: {
      type: STRING,
      allowNull: false,
      comment: '名称',
    },
    abstract: {
      type: TEXT,
      comment: '内容简介',
    },
    link: {
      type: STRING,
      comment: '链接',
    },
    creator: {
      type: STRING,
      comment: '创建者',
    },
    staff: {
      type: TEXT,
      comment: '工作人员',
    },
    price: {
      type: FLOAT,
      comment: '定价',
    },
    platform: {
      type: STRING,
      comment: '獲悉渠道',
    },
    tag: {
      type: STRING,
      comment: '标签',
    },
    publishDate: {
      type: DATEONLY,
      comment: '發表日期',
    },
    clutter: {
      type: INTEGER,
      comment: 'clutter ID',
    },
    remark: {
      type: STRING,
      comment: '备注',
    },
  },
  belongsTo: {
    Clutter: 'clutter',
  },
};

export default Entertainment;
