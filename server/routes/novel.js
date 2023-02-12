import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getNovel,
  getNovels,
  createNovel,
  // createNovels,
  modifyNovel,
  deleteNovel,
  contentNovel,
  chapterNovel,
  listChapter,
  contentChapter,
} from '../controllers/novel.js';

const router = new Router();

router.prefix('/api/novel');

router.get('/', async (ctx) => {
  const result = await getNovels({});
  // console.log(result)
  ctx.body = result;
});
router.post('/detail', async (ctx) => {
  const result = await getNovel(ctx.request.body);
  // console.log(result)
  ctx.body = result;
});
router.post('/detail/chapters', async (ctx) => {
  const result = await listChapter(ctx.request.body);
  ctx.body = result;
});
router.post('/detail/chapter', async (ctx) => {
  const result = await contentChapter(ctx.request.body);
  // console.log(result)
  ctx.body = result;
});

router.post('/add', genValidator('Novel', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createNovel(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyNovel(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteNovel(id);
  ctx.body = result;
});

router.post('/content', async (ctx) => {
  const result = await contentNovel(ctx.request.body);
  ctx.body = result;
});
router.post('/chapter', async (ctx) => {
  const result = await chapterNovel(ctx.request.body);
  ctx.body = result;
});

export default router;
