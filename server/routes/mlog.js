import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getMlogs,
  setMlog,
} from '../controllers/mlog.js';

const router = new Router();

router.prefix('/api/mlog');

router.get('/', async (ctx) => {
  const result = await getMlogs(ctx.request.query);
  ctx.body = result;
});

router.post('/add', genValidator('Mlog', validate), async (ctx) => {
  const result = await setMlog(ctx.request.body, ctx.request.files);
  ctx.body = result;
});

export default router;
