import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getHomes,
  getFollows,
  getFavorites,
  getDetail,
  getWiebo,
  getComment,
  getUsers,
  getBlock,
  setBlock,
  getUser,
  setUser,
  User,
  getRecord,
  setRecord,
  Record,
} from '../controllers/weibo.js';

const router = new Router();

router.prefix('/api/weibo');

// 爬虫数据
// home 頁
router.post('/whome', genValidator('Weibo', validate), async (ctx) => {
  const result = await getHomes(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
// 關注用戶
router.post('/wfollow', genValidator('Weibo', validate), async (ctx) => {
  const result = await getFollows(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
// 收藏列表
router.post('/wfavorite', genValidator('Weibo', validate), async (ctx) => {
  const result = await getFavorites(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
// 微博詳情
router.post('/wdetail', async (ctx) => {
  const result = await getDetail(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
router.post('/winfo', async (ctx) => {
  const result = await getWiebo(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
// 微博評論
router.post('/wcomment', async (ctx) => {
  const result = await getComment(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
// 微博文章
router.post('/warticle', async (ctx) => {
  const result = 'await getWiebo(ctx.request.body)';
  // console.log(result);
  ctx.body = result;
});

// 微博用戶
router.post('/wuser', async (ctx) => {
  const result = await getUsers(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

// 数据库操作
// 获取微博屏蔽
router.get('/block', async (ctx) => {
  const result = await getBlock();
  ctx.body = result;
});
// 保存微博屏蔽
router.post('/block/save', async (ctx) => {
  const result = await setBlock(ctx.request.body);
  ctx.body = result;
});

// 获取用户
router.get('/user', async (ctx) => {
  const result = await getUser(ctx.request.gquery);
  ctx.body = result;
});
// 保存用户
router.post('/user/save', async (ctx) => {
  const result = await setUser(ctx.request.body);
  ctx.body = result;
});
// 用户详情
router.get('/user/:id', async (ctx) => {
  console.log(ctx.request.params);
  const result = await User(ctx.request.params);
  ctx.body = result;
});

// 获取微博
router.get('/record', async (ctx) => {
  const result = await getRecord(ctx.request.gquery);
  ctx.body = result;
});
// 保存微博
router.post('/record/save', async (ctx) => {
  const result = await setRecord(ctx.request.body);
  ctx.body = result;
});
// 微博详情
router.get('/record/:id', async (ctx) => {
  console.log(ctx.request.params);
  const result = await Record(ctx.request.params);
  ctx.body = result;
});

export default router;
