import { STRING, DATEONLY, FLOAT, BOOLEAN } from '../types.js';

const Account = {
  model: {
    name: {
      type: STRING,
      allowNull: false,
      comment: '账号',
      unique: 'platform',
    },
    platform: {
      type: STRING,
      allowNull: false,
      comment: '主站URL',
    },
    link: {
      type: STRING,
      comment: '主页',
    },
    nickName: {
      type: STRING,
      comment: '昵称',
    },
    balance: {
      type: FLOAT,
      defaultValue: 0,
      comment: '余额',
    },
    pic: {
      type: STRING,
      comment: '账户头像',
    },
    desc: {
      type: STRING,
      comment: '账户描述',
    },
    paswd: {
      type: STRING,
      comment: '密码',
    },
    phone: {
      type: STRING,
      comment: '绑定手机',
    },
    email: {
      type: STRING,
      comment: '绑定邮箱',
    },
    verify: {
      type: BOOLEAN,
      comment: '实名认证',
    },
    IDCard: {
      type: STRING,
      comment: '绑定证件',
    },
    beginDate: {
      type: DATEONLY,
      comment: '开户日期',
    },
    endDate: {
      type: DATEONLY,
      comment: '销户日期',
    },
  },
  hasMany: {
    Atie: 'account',
  },
};

export default Account;
