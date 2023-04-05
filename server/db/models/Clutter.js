import { TEXT, STRING } from '../types.js';

/**
 * 杂项
 * doulist 名称 id
 * group 名称 id
 * weibo 内容JSON weiboid 微博屏蔽
 * follow 内容JSON id 地址 微博关注用户
 * noveler 内容JSON 爬虫配置
 */
const Clutter = {
  model: {
    type: {
      type: STRING,
      allowNull: false,
      comment: '类型',
    },
    phrase: {
      type: STRING,
      comment: 'id',
      unique: 'type',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
  },
};

export default Clutter;
