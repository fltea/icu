import { TEXT, STRING } from '../types.js';

/**
 * 杂项
 */
const Clutter = {
  model: {
    type: {
      type: STRING,
      allowNull: false,
      comment: '类型',
    },
    phrase: {
      type: STRING,
      comment: 'id',
      unique: 'type',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
  },
};

export default Clutter;
