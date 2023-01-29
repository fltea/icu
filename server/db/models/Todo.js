import { STRING, TEXT, DATE, DATEONLY } from '../types.js';

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
    beginDate: {
      type: DATEONLY,
      comment: '开始时间',
    },
    endDate: {
      type: DATEONLY,
      comment: '结束时间',
    },
    deadline: {
      type: DATE,
      comment: '截止日期',
    },
    completeDate: {
      type: DATE,
      comment: '完成时间',
    },
    dropDate: {
      type: DATE,
      comment: '放弃时间',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
  hasMany: {
    Article: 'todo',
    PicTie: 'todo',
  },
};

export default Todo;
