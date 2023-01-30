import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getNovel,
  getNovels,
  createNovel,
  // createNovels,
  modifyNovel,
  deleteNovel,
} from '../controllers/novel.js';

const router = new Router();

router.prefix('/api/novel');

router.get('/', async (ctx) => {
  const result = await getNovels({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Novel', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createNovel(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Novel', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyNovel(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteNovel(id);
  ctx.body = result;
});

export default router;
