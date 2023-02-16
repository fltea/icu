import { STRING, TEXT } from '../types.js';

const Mlog = {
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
      type: TEXT,
      comment: 'Source',
    },
    remark: {
      type: STRING,
      comment: '备注',
    },
  },
};

export default Mlog;
