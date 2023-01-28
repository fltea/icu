import Router from 'koa-router';

import { uploadFile } from '../controllers/common.js';

const router = new Router();
router.prefix('/api/common');

router.post('/upload', async (ctx) => {
  // console.log('ctx.request.files ', ctx.request.files);
  const result = uploadFile(ctx.request.files);
  ctx.body = result;
});

// module.exports = router;
export default router;
