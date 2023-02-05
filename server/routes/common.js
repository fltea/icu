import Router from 'koa-router';

import { uploadFile, backupDatas, restoreDatas, backups } from '../controllers/common.js';

const router = new Router();
router.prefix('/api/common');

router.post('/upload', async (ctx) => {
  // console.log('ctx.request.files ', ctx.request.files);
  const result = uploadFile(ctx.request.files);
  ctx.body = result;
});

router.get('/backups', async (ctx) => {
  // console.log("ctx.request.body ", ctx.request.body);
  const result = await backups();
  ctx.body = result;
});
router.post('/backup', async (ctx) => {
  // console.log("ctx.request.body ", ctx.request.body);
  const result = await backupDatas();
  ctx.body = result;
});
router.post('/restore', async (ctx) => {
  // console.log("ctx.request.body ", ctx.request.body);
  const result = await restoreDatas(ctx.request.body);
  ctx.body = result;
});

// module.exports = router;
export default router;
