import Router from 'koa-router';

import {
  getBlogs,
} from '../controllers/blog.js';

const router = new Router();

router.prefix('/api/blog');

router.get('/', async (ctx) => {
  const result = await getBlogs({});
  // console.log(result)
  ctx.body = result;
});

export default router;
