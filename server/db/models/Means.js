import { STRING, TEXT, DATE, FLOAT } from '../types.js';

const Means = {
  model: {
    name: {
      type: STRING,
      allowNull: false,
      comment: '名称',
    },
    code: {
      type: STRING,
      comment: '编号',
    },
    organization: {
      type: STRING,
      comment: '单位',
    },
    book: {
      type: STRING,
      comment: '书籍',
    },
    found: {
      type: STRING,
      comment: '基金',
    },
    stock: {
      type: STRING,
      comment: '股票',
    },
    beginDate: {
      type: DATE,
      comment: '开始日期',
    },
    endDate: {
      type: DATE,
      comment: '结束日期',
    },
    scale: {
      type: FLOAT,
      comment: '本金',
    },
    price: {
      type: FLOAT,
      comment: '买入价格',
    },
    inDate: {
      type: DATE,
      comment: '买入日期',
    },
    outDate: {
      type: DATE,
      comment: '卖出日期',
    },
    rate: {
      type: FLOAT,
      comment: '利率(%)',
    },
    amount: {
      type: FLOAT,
      comment: '本息',
    },
    content: {
      type: STRING,
      comment: '内容',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
  hasMany: {
    PicTie: 'means',
  },
};

export default Means;
