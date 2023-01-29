import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getPic,
  getVideos,
  createVideo,
  modifyVideo,
  deleteVideo,
} from '../controllers/video.js';

const router = new Router();

router.prefix('/api/video');

router.get('/', async (ctx) => {
  const result = await getVideos({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', async (ctx) => {
  // console.log('ctx.request.files ', ctx.request.files);
  const result = await createVideo(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Video', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyVideo(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteVideo(id);
  ctx.body = result;
});

// module.exports = router;
export default router;
