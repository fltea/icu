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
  getUser,
  createSource,
  getArticles,
} from '../controllers/weibo.js';

const router = new Router();

router.prefix('/api/weibo');

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
  const result = await getUser(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

// 用戶操作
// 微博操作
// 文章操作

router.post('/', genValidator('Weibo', validate), async (ctx) => {
  const result = await getHomes(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});
router.post('/follows', genValidator('Weibo', validate), async (ctx) => {
  const result = await getFollows(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

router.post('/userlist', async (ctx) => {
  const result = await getUser(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

router.post('/save', async (ctx) => {
  const result = await createSource(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

router.post('/detail', async (ctx) => {
  const result = await getWiebo(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

router.post('/comments', async (ctx) => {
  const result = await getComment(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

router.post('/articles', async (ctx) => {
  const result = await getArticles(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

export default router;
