import { INTEGER, DATE, FLOAT, TEXT } from '../types.js';

const Statistic = {
  model: {
    type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '统计类型: 年 月',
    },
    date: {
      type: DATE,
      allowNull: false,
      comment: '统计时间',
    },
    income: {
      type: FLOAT,
      comment: '收入',
    },
    expense: {
      type: FLOAT,
      comment: '支出',
    },
    found: {
      type: FLOAT,
      comment: '基金',
    },
    stock: {
      type: FLOAT,
      comment: '股票',
    },
    deposit: {
      type: FLOAT,
      comment: '定期',
    },
    bank: {
      type: FLOAT,
      comment: '存款',
    },
    cash: {
      type: FLOAT,
      comment: '现金',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
};

export default Statistic;
