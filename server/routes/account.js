import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getAccount,
  getAccounts,
  createAccount,
  // createAccounts,
  modifyAccount,
  deleteAccount,
} from '../controllers/account.js';

const router = new Router();

router.prefix('/api/account');

router.get('/', async (ctx) => {
  const result = await getAccounts({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Account', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createAccount(ctx.request.body);
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
