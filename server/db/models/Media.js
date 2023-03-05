import { STRING, INTEGER, TEXT, DATEONLY, FLOAT, BOOLEAN } from '../types.js';

// 大众传播媒介
const Media = {
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
    url: {
      type: STRING,
      comment: '链接',
    },
    type: {
      type: STRING,
      comment: '类型 书 小说 影片 电视剧 图片',
    },
    creator: {
      type: STRING,
      comment: '创建者',
    },
    staff: {
      type: TEXT,
      comment: '工作人员',
    },
    ISBN: {
      type: STRING,
      comment: 'ISBN',
    },
    loaded: {
      type: INTEGER,
      comment: '已下载数量',
    },
    finish: {
      type: BOOLEAN,
      comment: '已下载完',
    },
    price: {
      type: FLOAT,
      comment: '定价',
    },
    channel: {
      type: STRING,
      comment: '渠道',
    },
    tag: {
      type: STRING,
      comment: '标签',
    },
    publishDate: {
      type: DATEONLY,
      comment: '日期',
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

export default Media;
