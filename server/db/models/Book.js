import { STRING, FLOAT, INTEGER, TEXT, DATEONLY } from '../types.js';
/**
    * 作者:  [美国] 詹姆斯·格雷克
    出版社: 人民邮电出版社
    出品方: 图灵教育
    原作名: The Information: A History, A Theory, A Flood
    译者: 高博
    出版年: 2013-11-1
    页数: 476
    定价: 69.00元
    装帧: 平装
    丛书: 图灵新知
    ISBN: 9787115331809
  */

const Book = {
  model: {
    title: {
      type: STRING,
      allowNull: false,
      comment: '名称',
    },
    name: {
      type: STRING,
      comment: '原作名',
    },
    abstract: {
      type: TEXT,
      comment: '内容简介',
    },
    author: {
      type: STRING,
      comment: '作者',
    },
    translator: {
      type: STRING,
      comment: '译者',
    },
    ISBN: {
      type: STRING,
      comment: 'ISBN',
    },
    publish: {
      type: STRING,
      comment: '出版社',
    },
    produced: {
      type: STRING,
      comment: '出品方',
    },
    series: {
      type: STRING,
      comment: '丛书',
    },
    binding: {
      type: STRING,
      comment: '装帧',
    },
    pages: {
      type: INTEGER,
      comment: '页数',
    },
    price: {
      type: FLOAT,
      comment: '定价',
    },
    publishDate: {
      type: DATEONLY,
      comment: '出版日期',
    },
    cover: {
      type: STRING,
      comment: '封面',
    },
    tag: {
      type: STRING,
      comment: '标签',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
  hasMany: {
    Article: 'book',
    PicTie: 'book',
  },
};

export default Book;
