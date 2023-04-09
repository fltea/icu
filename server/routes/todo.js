import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getTodos,
  setTodo,
  modTodo,
  delTodo,
} from '../controllers/todo.js';

const router = new Router();

router.prefix('/api/todo');

router.get('/', async (ctx) => {
  const result = await getTodos(ctx.request.query);
  // console.log(result)
  ctx.body = result;
});

router.post('/add', genValidator('Todo', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await setTodo(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Todo', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modTodo(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await delTodo(id);
  ctx.body = result;
});
router.post('/actions', genValidator('NeedId', validate), async (ctx) => {
  const result = await modTodo(ctx.request.body);
  ctx.body = result;
});

export default router;
