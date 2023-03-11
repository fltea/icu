import Router from 'koa-router';

import { backupDatas, restoreDatas, backups } from '../controllers/backup.js';

const router = new Router();
router.prefix('/api/backup');

router.post('/', async (ctx) => {
  // console.log("ctx.request.body ", ctx.request.body);
  const result = await backupDatas();
  ctx.body = result;
});

router.get('/backups', async (ctx) => {
  // console.log("ctx.request.body ", ctx.request.body);
  const result = await backups();
  ctx.body = result;
});

router.post('/restore', async (ctx) => {
  // console.log("ctx.request.body ", ctx.request.body);
  const result = await restoreDatas(ctx.request.body);
  ctx.body = result;
});

export default router;
