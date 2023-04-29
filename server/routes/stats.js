import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getStats,
  getStatss,
  createStats,
  // createStatss,
  modifyStats,
  deleteStats,
} from '../controllers/stats.js';

const router = new Router();

router.prefix('/api/statistic');

router.get('/', async (ctx) => {
  const result = await getStatss({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Stats', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createStats(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Stats', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyStats(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteStats(id);
  ctx.body = result;
});

export default router;
