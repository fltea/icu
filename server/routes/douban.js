import Router from 'koa-router';

import {
  getDoulist,
  getDetails,
  createSource,
  getDoulistList,
  saveDoulistList,
} from '../controllers/douban.js';

const router = new Router();

router.prefix('/api/douban');
router.post('/doulist', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDoulist(ctx.request.body);
  ctx.body = result;
});
router.post('/doulist/articles', async (ctx) => {
  const result = await saveDoulistList(ctx.request.body);
  ctx.body = result;
});
router.post('/doulist/:doulist', async (ctx) => {
  // console.log(ctx.request.params);
  const { doulist } = ctx.request.params;
  const result = await getDoulistList(doulist);
  // console.log(result);
  ctx.body = result;
});

router.post('/details', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDetails(ctx.request.body);
  ctx.body = result;
});

router.post('/save', async (ctx) => {
  const result = await createSource(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

export default router;
