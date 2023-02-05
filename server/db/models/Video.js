import { STRING, TEXT, INTEGER } from '../types.js';

const Video = {
  model: {
    title: {
      type: STRING,
      comment: '标题',
    },
    text: {
      type: TEXT,
      comment: '描述内容',
    },
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
      comment: 'BlogID',
    },
    source: {
      type: INTEGER,
      comment: 'sourceID',
    },
    remark: {
      type: STRING,
      comment: '备注',
    },
  },
  belongsTo: {
    Blog: 'blog',
    Source: 'source',
  },
  hasMany: {
    PicTie: 'video',
  },
};

export default Video;
