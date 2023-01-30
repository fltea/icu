import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getSource,
  getSources,
  createSource,
  // createSources,
  modifySource,
  deleteSource,
} from '../controllers/source.js';

const router = new Router();

router.prefix('/api/source');

router.get('/', async (ctx) => {
  const result = await getSources({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Source', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createSource(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Source', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifySource(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteSource(id);
  ctx.body = result;
});

export default router;
