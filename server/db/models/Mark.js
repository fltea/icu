/**
 * Marks 书签
 */

import { STRING, TEXT } from '../types.js';

const Mark = {
  model: {
    url: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '地址',
    },
    title: {
      type: STRING,
      allowNull: false,
      comment: '标题',
    },
    description: {
      type: TEXT,
      comment: '描述',
    },
    icons: {
      type: TEXT,
      comment: '图标',
    },
  },
};

export default Mark;
