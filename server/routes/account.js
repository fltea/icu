import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getAccount,
  getAccounts,
  createAccount,
  // createAccounts,
  modifyAccount,
  deleteAccount,
  tieAccount,
  modifyTieAccount,
} from '../controllers/account.js';

const router = new Router();

router.prefix('/api/account');

router.get('/', async (ctx) => {
  const result = await getAccounts(ctx.request.gquery);
  // console.log(result)
  ctx.body = result;
});
router.post('/detail', genValidator('NeedId', validate), async (ctx) => {
  const { id } = ctx.request.body;
  const result = await getAccount(id);
  // console.log(result)
  ctx.body = result;
});

router.post('/add', genValidator('Account', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createAccount(ctx.request.body);
  ctx.body = result;
});

router.post('/tied', genValidator('Atie', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await tieAccount(ctx.request.body);
  ctx.body = result;
});
router.post('/tied/modify', async (ctx) => {
  const result = await modifyTieAccount(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Account', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyAccount(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteAccount(id);
  ctx.body = result;
});

export default router;
