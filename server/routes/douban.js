import Router from 'koa-router';

import { getDoulist } from '../controllers/douban.js';

const router = new Router();

router.prefix('/api/douban');
router.post('/doulist', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDoulist(ctx.request.body);
  ctx.body = result;
});

export default router;
