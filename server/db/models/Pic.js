import { STRING, INTEGER, TEXT } from '../types.js';

const Pic = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      comment: '地址',
    },
    link: {
      type: STRING,
      comment: '外部链接',
    },
    creator: {
      type: STRING,
      comment: '上传者',
    },
    blog: {
      type: INTEGER,
      comment: '关联BlogID',
    },
    video: {
      type: INTEGER,
      comment: '关联VideoID',
    },
    text: {
      type: TEXT,
      comment: '转文字',
    },
    remark: {
      type: STRING,
      comment: '备注',
    },
  },
  belongsTo: {
    Blog: 'blog',
    Video: 'video',
  },
};

export default Pic;
