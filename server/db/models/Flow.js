import { INTEGER, DATE, FLOAT, STRING, TEXT } from '../types.js';

const Flow = {
  model: {
    type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '类型: 支出0 收入1 默认 支出',
    },
    createTime: {
      type: DATE,
      allowNull: false,
      comment: '创建时间',
    },
    fee: {
      type: FLOAT,
      allowNull: false,
      comment: '金额',
    },
    commission: {
      type: FLOAT,
      comment: '手续费',
    },
    amount: {
      type: FLOAT,
      comment: '数量',
    },
    price: {
      type: FLOAT,
      comment: '价格',
    },
    rete: {
      type: FLOAT,
      comment: '利率(%)',
    },
    beginDate: {
      type: DATE,
      comment: '开始时间',
    },
    endDate: {
      type: DATE,
      comment: '结束时间',
    },
    name: {
      type: STRING,
      comment: '名称',
    },
    tag: {
      type: STRING,
      comment: '类型：股票 基金 定期 日用 工资 ……',
    },
    means: {
      type: INTEGER,
      comment: '资产',
    },
    inAccount: {
      type: INTEGER,
      comment: '入账',
    },
    outAccount: {
      type: INTEGER,
      comment: '出账',
    },
    tieRelation: {
      type: INTEGER,
      comment: '支付关系',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
};

export default Flow;
