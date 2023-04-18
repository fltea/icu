import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getPropertys,
  setProperty,
  modProperty,
} from '../controllers/property.js';

const router = new Router();

router.prefix('/api/property');

router.get('/', async (ctx) => {
  const result = await getPropertys(ctx.request.query);
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Property', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await setProperty(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Property', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modProperty(ctx.request.body);
  ctx.body = result;
});

export default router;
