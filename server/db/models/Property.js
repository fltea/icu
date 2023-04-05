import { STRING, TEXT, DATE, FLOAT } from '../types.js';

// property 属性；财产；财产权；【戏】道具
// 所有物；财产；财物a thing or things that are owned by sb; a possession or possessions
const Property = {
  model: {
    name: {
      type: STRING,
      allowNull: false,
      comment: '名称',
    },
    type: {
      type: STRING,
      comment: '类型',
    },
    code: {
      type: STRING,
      comment: '编号',
    },
    channel: {
      type: STRING,
      comment: '渠道',
    },
    beginDate: {
      type: DATE,
      comment: '开始日期',
    },
    endDate: {
      type: DATE,
      comment: '结束日期',
    },
    price: {
      type: FLOAT,
      comment: '买入价格',
    },
    inDate: {
      type: DATE,
      comment: '入手日期',
    },
    outDate: {
      type: DATE,
      comment: '出手日期',
    },
    rate: {
      type: FLOAT,
      comment: '利率(%)',
    },
    amount: {
      type: FLOAT,
      comment: '卖出价格',
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
};

export default Property;
