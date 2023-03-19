import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';
import { delMedia, getMediaInfo, getMedias, modMedia, setMedia, updateMedia } from '../controllers/media.js';

const router = new Router();

router.prefix('/api/media');

router.get('/', async (ctx) => {
  const result = await getMedias(ctx.request.gquery);
  ctx.body = result;
});
router.get('/:id', async (ctx) => {
  console.log(ctx.request.params);
  const result = await getMediaInfo();
  ctx.body = result;
});

router.post('/upload', async (ctx) => {
  // console.log('ctx.request.files ', ctx.request.body, ctx.request.files);
  let params = ctx.request.files;
  const { url } = ctx.request.body;
  if (!params) {
    if (url) {
      params = ctx.request.body;
    } else {
      params = {};
    }
  }
  const result = await updateMedia(params);
  ctx.body = result;
});

router.post('/add', genValidator('Media', validate), async (ctx) => {
  const result = await setMedia(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', async (ctx) => {
  const result = await modMedia(ctx.request.body);
  ctx.body = result;
});
router.post('/del', async (ctx) => {
  const result = await delMedia(ctx.request.body);
  ctx.body = result;
});

export default router;
