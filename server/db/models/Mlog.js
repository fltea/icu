import { TEXT } from '../types.js';

const Mlog = {
  model: {
    text: {
      type: TEXT,
      allowNull: false,
      comment: '内容',
    },
    infos: {
      type: TEXT,
      comment: '图片 多张，视频 1个',
    },
  },
};

export default Mlog;
