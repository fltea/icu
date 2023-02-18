import { STRING, TEXT, DATE, DATEONLY, INTEGER, BOOLEAN } from '../types.js';

const Todo = {
  model: {
    title: {
      type: STRING,
      allowNull: false,
      comment: '标题',
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: '内容',
    },
    order: {
      type: INTEGER,
      defaultValue: 0,
      comment: '优先级: 0, 1',
    },
    beginDate: {
      type: DATEONLY,
      comment: '开始时间',
    },
    deadline: {
      type: DATEONLY,
      comment: '截止日期',
    },
    completeDate: {
      type: DATE,
      comment: '完成时间',
    },
    discarded: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '废弃',
    },
    disuseTime: {
      type: DATE,
      comment: '放弃时间',
    },
  },
};

export default Todo;
