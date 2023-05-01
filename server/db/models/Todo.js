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
    time: {
      type: INTEGER,
      comment: '要求次数',
    },
    state: {
      type: INTEGER,
      defaultValue: 0,
      comment: '状态',
    },
    beginDate: {
      type: DATEONLY,
      comment: '开始日期',
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
      comment: '废弃时间',
    },
  },
};

export default Todo;
