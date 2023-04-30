import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getStatistics,
  setStatistic,
  modStatistic,
  delStatistic,
} from '../controllers/statistic.js';

const router = new Router();

router.prefix('/api/statistic');

router.get('/', async (ctx) => {
  const result = await getStatistics(ctx.request.query);
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
  const result = await setStatistic(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Stats', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modStatistic(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await delStatistic(id);
  ctx.body = result;
});

export default router;
