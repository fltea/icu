import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getNoveler,
  getNovelers,
  createNoveler,
  // createNovelers,
  modifyNoveler,
  deleteNoveler,
} from '../controllers/noveler.js';

const router = new Router();

router.prefix('/api/noveler');

router.get('/', async (ctx) => {
  const result = await getNovelers({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Noveler', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createNoveler(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Noveler', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyNoveler(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteNoveler(id);
  ctx.body = result;
});

export default router;
