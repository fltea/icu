import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getFlow,
  getFlows,
  setFlow,
  modFlow,
  delFlow,
} from '../controllers/flow.js';

const router = new Router();

router.prefix('/api/flow');

router.get('/', async (ctx) => {
  const result = await getFlows(ctx.request.query);
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Flow', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await setFlow(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Flow', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modFlow(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await delFlow(id);
  ctx.body = result;
});

export default router;
