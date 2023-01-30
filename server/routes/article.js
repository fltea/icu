import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getArticle,
  getArticles,
  createArticle,
  // createArticles,
  modifyArticle,
  deleteArticle,
} from '../controllers/article.js';

const router = new Router();

router.prefix('/api/article');

router.get('/', async (ctx) => {
  const result = await getArticles({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Article', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createArticle(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Article', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyArticle(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteArticle(id);
  ctx.body = result;
});

export default router;
