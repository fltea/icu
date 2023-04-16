import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getArticles,
  setArticle,
  modArticle,
  setMedias,
  getArticle,
} from '../controllers/article.js';

const router = new Router();

router.prefix('/api/article');

router.get('/', async (ctx) => {
  const result = await getArticles(ctx.request.query);
  // console.log(result)
  ctx.body = result;
});
router.get('/:id', async (ctx) => {
  const result = await getArticle(ctx.params.id);
  // console.log(result)
  ctx.body = result;
});

router.post('/add', genValidator('Article', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await setArticle(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modArticle(ctx.request.body);
  ctx.body = result;
});
router.post('/upload', genValidator('files', validate), async (ctx) => {
  const result = await setMedias(ctx.request.files);
  ctx.body = result;
});

export default router;
