import Router from 'koa-router';

import { getDoulist, getDetails, createSource } from '../controllers/douban.js';

const router = new Router();

router.prefix('/api/douban');
router.post('/doulist', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDoulist(ctx.request.body);
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
