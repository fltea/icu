import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getBook,
  getBooks,
  createBook,
  // createBooks,
  modifyBook,
  deleteBook,
} from '../controllers/book.js';

const router = new Router();

router.prefix('/api/book');

router.get('/', async (ctx) => {
  const result = await getBooks({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Book', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createBook(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Book', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyBook(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteBook(id);
  ctx.body = result;
});

export default router;
