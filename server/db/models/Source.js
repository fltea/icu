const { STRING, TEXT, DATE } = require("../types");

const Source = {
  model: {
    basic: {
      type: TEXT,
      comment: "原始数据",
    },
    basicId: {
      type: STRING,
      comment: "原始Id",
    },
    plaform: {
      type: STRING,
      comment: "来源平台",
    },
    link: {
      type: STRING,
      comment: "来源链接",
    },
    author: {
      type: STRING,
      comment: "作者",
    },
    authorLink: {
      type: STRING,
      comment: "作者链接",
    },
    publishTime: {
      type: DATE,
      comment: "发表日期",
    },
  },
};

module.exports = Source;