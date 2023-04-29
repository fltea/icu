import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getAccount,
  getAccounts,
  setAccount,
  modAccount,
  delAccount,
  tieAccount,
  modAccountTie,
} from '../controllers/account.js';

const router = new Router();

router.prefix('/api/account');

router.get('/', async (ctx) => {
  const result = await getAccounts(ctx.request.query);
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
  const result = await setAccount(ctx.request.body);
  ctx.body = result;
});

router.post('/tied', genValidator('Atie', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await tieAccount(ctx.request.body);
  ctx.body = result;
});
router.post('/tied/modify', genValidator('Atie', validate), async (ctx) => {
  const result = await modAccountTie(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Account', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modAccount(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await delAccount(id);
  ctx.body = result;
});

export default router;
