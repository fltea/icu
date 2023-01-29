import { INTEGER, TEXT, DATEONLY } from '../types.js';

const TieRelation = {
  model: {
    tied: {
      type: INTEGER,
      allowNull: false,
      comment: '被绑定账户',
    },
    account: {
      type: INTEGER,
      allowNull: false,
      comment: '绑定账户',
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

export default TieRelation;
