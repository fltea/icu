import { STRING, DATE, INTEGER } from '../types.js';

const Action = {
  model: {
    content: {
      type: STRING,
      allowNull: false,
      comment: '内容',
    },
    time: {
      type: DATE,
      allowNull: false,
      comment: '时间',
    },
    todo: {
      type: INTEGER,
      allowNull: false,
      comment: 'Todo ID',
    },
  },
  belongsTo: {
    Todo: 'todo',
  },
};

export default Action;
