// 默认 limit
export const PAGE_SIZE = 20;

// 文件夹路径
const dpath = 'files';

// 默认文件夹
export const FILE_DIR = dpath;
// 默认 log 文件夹
export const LOG_DIR = `${dpath}/logs`;

// 請求設置
export const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';

// 微博
export const WEIBO_CONF = {
  home: 'https://m.weibo.cn/feed/friends',
  favorite: 'https://m.weibo.cn/api/container/getIndex?containerid=230259&openApp=0',
  detail: 'https://m.weibo.cn/detail/{id}',
  detailS: 'https://m.weibo.cn/statuses/show?id={id}',
  comment: 'https://m.weibo.cn/comments/hotflow?id={id}&mid={id}&max_id_type=0',
  delFav: 'https://m.weibo.cn/api/statuses/destroyfav',
  user: 'https://m.weibo.cn/profile/info?uid={id}',
  userList: 'https://m.weibo.cn/api/container/getIndex?type=uid&value={id}&containerid=230413{id}_-_WEIBO_SECOND_PROFILE_WEIBO', // page_type: 03  since_id: 4812900419764247
  article: 'https://weibo.com/ttarticle/p/show?id={id}&luicode={luicode}',
};

// 豆瓣
export const DOUBAN_CONF = {
  list: 'https://www.douban.com/doulist/{id}/',
  detail: 'https://www.douban.com/group/topic/{id}/',
};
