import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getMeans,
  getMeansList,
  createMeans,
  // createMeanss,
  modifyMeans,
  deleteMeans,
} from '../controllers/means.js';

const router = new Router();

router.prefix('/api/means');

router.get('/', async (ctx) => {
  const result = await getMeansList(ctx.request.query);
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Means', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createMeans(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Means', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyMeans(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteMeans(id);
  ctx.body = result;
});

export default router;
