import { STRING, TEXT } from '../types.js';

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
    text: {
      type: TEXT,
      comment: '转文字',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
};

export default Pic;
