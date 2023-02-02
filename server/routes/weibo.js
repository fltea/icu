import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getWiebo,
  getHomes,
  getFollows,
  getUsers,
  createSource,
  getComments,
  getArticles,
} from '../controllers/weibo.js';

const router = new Router();

router.prefix('/api/weibo');
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
  const result = await getUsers(ctx.request.body);
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
  const result = await getComments(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

router.post('/articles', async (ctx) => {
  const result = await getArticles(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

export default router;
