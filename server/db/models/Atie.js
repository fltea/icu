import { INTEGER, TEXT, DATEONLY, STRING } from '../types.js';

const Atie = {
  model: {
    tied: {
      type: INTEGER,
      allowNull: false,
      comment: '被绑定账户',
    },
    tiedName: {
      type: STRING,
      comment: '被绑定账户昵称',
    },
    account: {
      type: INTEGER,
      allowNull: false,
      comment: '绑定账户',
    },
    accountName: {
      type: STRING,
      comment: '绑定账户昵称',
    },
    tieDate: {
      type: DATEONLY,
      comment: '绑定时间',
    },
    untieDate: {
      type: DATEONLY,
      comment: '解绑时间',
    },
    remark: {
      type: TEXT,
      comment: '备注',
    },
  },
  belongsTo: {
    Account: 'tied',
  },
};

export default Atie;
