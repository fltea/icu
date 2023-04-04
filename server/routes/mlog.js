import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getMlog,
  getMlogs,
  createMlog,
  // createMlogs,
  modifyMlog,
  deleteMlog,
} from '../controllers/mlog.js';

const router = new Router();

router.prefix('/api/mlog');

router.get('/', async (ctx) => {
  const result = await getMlogs(ctx.request.query);
  ctx.body = result;
});

router.post('/add', genValidator('Mlog', validate), async (ctx) => {
  const result = await createMlog(ctx.request.body);
  ctx.body = result;
});

router.post('/modify', genValidator('Mlog', validate), async (ctx) => {
  const result = await modifyMlog(ctx.request.body);
  ctx.body = result;
});

router.post('/delete', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteMlog(id);
  ctx.body = result;
});

export default router;
