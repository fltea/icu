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
      comment: '单价',
    },
    count: {
      type: FLOAT,
      comment: '数量',
    },
    inDate: {
      type: DATE,
      comment: '入手日期',
    },
    outDate: {
      type: DATE,
      comment: '出手日期',
    },
    scale: {
      type: FLOAT,
      comment: '收益率',
    },
    amount: {
      type: FLOAT,
      comment: '卖出价格',
    },
    media: {
      type: STRING,
      comment: '图片或影片',
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
