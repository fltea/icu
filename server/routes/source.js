import Router from 'koa-router';

const router = new Router();

router.prefix('/api/source');

router.post('/add', async (ctx) => {
  console.log('ctx.request.body ', ctx.request.body);
  ctx.body = 'result';
});

export default router;
