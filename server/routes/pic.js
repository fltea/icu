import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getPic,
  getPics,
  createPic,
  modifyPic,
  deletePic,
} from '../controllers/pic.js';

const router = new Router();

router.prefix('/api/pic');

router.get('/', async (ctx) => {
  const result = await getPics({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Pic', validate), async (ctx) => {
  // console.log('ctx.request.files ', ctx.request.files);
  const result = await createPic(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Pic', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyPic(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deletePic(id);
  ctx.body = result;
});

// module.exports = router;
export default router;
