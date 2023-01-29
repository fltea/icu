import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getBlog,
  getBlogs,
  createBlog,
  // createBlogs,
  modifyBlog,
  deleteBlog,
} from '../controllers/blog.js';

const router = new Router();

router.prefix('/api/blog');

router.get('/', async (ctx) => {
  const result = await getBlogs({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Blog', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createBlog(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Blog', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyBlog(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteBlog(id);
  ctx.body = result;
});

export default router;
