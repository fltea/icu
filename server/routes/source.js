const router = require('koa-router')();

router.prefix('/api/source');

router.post('/add', async (ctx) => {
  console.log('ctx.request.body ', ctx.request.body);
  ctx.body = 'result';
});

module.exports = router;
