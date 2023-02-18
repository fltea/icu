import { TEXT, STRING } from '../types.js';

/**
 * doulist 名称 id
 * weibo 内容JSON weiboid 微博屏蔽
 * follow 内容JSON id 地址 微博关注用户
 * noveler 内容JSON 爬虫配置
 *
 */
const Clutter = {
  model: {
    type: {
      type: STRING,
      allowNull: false,
      comment: '类型',
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
    phrase: {
      type: STRING,
      comment: '短内容',
    },
  },
  hasMany: {
    // 小说
    Novel: 'clutter',
    // 爬虫数据
    Chapter: 'clutter',
  },
};

export default Clutter;
