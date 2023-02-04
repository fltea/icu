import { TEXT, STRING } from '../types.js';

// doulist Noveler weiboid
const Clutter = {
  model: {
    type: {
      type: STRING,
      allowNull: false,
      comment: '类型',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
    phrase: {
      type: STRING,
      comment: '短内容',
    },
  },
};

export default Clutter;
