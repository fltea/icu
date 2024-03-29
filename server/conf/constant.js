// 默认 limit
export const PAGE_SIZE = 20;

// 文件夹路径
const dpath = 'files';

// 默认文件夹
export const FILE_DIR = dpath;
// 默认 log 文件夹
export const LOG_DIR = `${dpath}/logs`;
// 默认 backup 文件夹
export const BACKUP_DIR = `${dpath}/backups`;
// 默认 temp 文件夹
export const TEMP_DIR = `${dpath}/temps`;
// 默认 cookies 文件夹
export const COOKIES_DIR = `${dpath}/cookies`;
// 默认 media 文件夹
export const MEDIA_DIR = `${dpath}/media`;

// 数据库 类型设定

/**
 * doulist 名称 id
 * group 名称 id
 * weibo 内容JSON weiboid 微博屏蔽
 * follow 内容JSON id 地址 微博关注用户
 * noveler 内容JSON 爬虫配置
 */
export const CRTYPE = {
  DLIST: 'doubanDoulist',
  DGROUP: 'doubanGroup',
  WEIBO: 'weiboDetail',
  WUSER: 'weiboUser',
  WARTICLE: 'weiboArticle',
  WBLOCK: 'weiboBlock',
  NOVEL: 'noveler',
};

// flow type  类型: 支出0 收入1
export const FLTYPE = '支出,收入';
// flow tag 股票 基金 定期 吃 穿 住 行 通信(手机 网络) 红包 借款 工资 数码产品(手机 电脑 平板 相机) 旅游 贷款 教育 健康 娱乐
export const FLTAG = '股票,基金,定期,吃,穿,住,行,通信(手机/网络等),红包,借款,工资,数码产品(手机/电脑/平板/相机等),旅游,贷款,教育,健康,娱乐';

// media type 类型 书 小说 影片 电视剧 图片 视频
export const METYPE = '书,小说,电影,电视,图片,视频';
// media channel 渠道 douban weibo twitter
export const MECHANNEL = '豆瓣,微博,推特,她乡';

// Statistic type  类型: 月 年
export const STTYPE = '月,年';

// Todo state  状态 待机 进行时 超时 完成
export const TOSTATE = '待机,进行时,完成,超时';

// 請求設置
export const UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';

// 微博
export const WEIBO_CONF = {
  home: 'https://m.weibo.cn/feed/friends',
  favorite: 'https://m.weibo.cn/api/container/getIndex?containerid=230259&openApp=0',
  follow: 'https://m.weibo.cn/api/container/getIndex?containerid=231093_-_selffollowed',
  detail: 'https://m.weibo.cn/detail/{id}',
  detailE: 'https://m.weibo.cn/statuses/extend?id={id}',
  detailS: 'https://m.weibo.cn/statuses/show?id={id}',
  // https://weibo.com/ajax/statuses/show?id=MxHWMlXnG
  detailCom: 'https://weibo.com/ajax/statuses/show?id={id}',
  comment: 'https://m.weibo.cn/comments/hotflow?id={id}&mid={id}&max_id_type=0',
  delFav: 'https://m.weibo.cn/api/statuses/destroyfav',
  user: 'https://m.weibo.cn/profile/info?uid={id}',
  userLink: 'https://m.weibo.cn/profile/{id}',
  // https://m.weibo.cn/api/container/getIndex?uid=1357064103&luicode=10000011&lfid=231093_-_selffollowed&containerid=1076031357064103&since_id=4864658320132222
  userList: 'https://m.weibo.cn/api/container/getIndex?type=uid&value={id}&containerid=107603{id}', // page_type: 03  since_id: 4812900419764247
  article: 'https://weibo.com/ttarticle/p/show?id={id}',
  articleP: 'https://weibo.com/p/{pid}',
  pindex: 'https://m.weibo.cn/api/container/getIndex?containerid=10080862239e6c0f995ae1fdc00d18b7905eac_-_feed',
};

// 豆瓣
export const DOUBAN_CONF = {
  list: 'https://www.douban.com/doulist/{id}/',
  detail: 'https://www.douban.com/group/topic/{id}/',
};
