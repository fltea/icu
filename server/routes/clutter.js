import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getClutter,
  getClutters,
  createClutter,
  // createClutters,
  modifyClutter,
  deleteClutter,
} from '../controllers/clutter.js';

const router = new Router();

router.prefix('/api/clutter');

router.get('/', async (ctx) => {
  const result = await getClutters({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Clutter', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createClutter(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Clutter', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyClutter(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteClutter(id);
  ctx.body = result;
});

export default router;
