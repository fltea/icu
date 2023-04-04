import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getTodo,
  getTodos,
  createTodo,
  // createTodos,
  modifyTodo,
  deleteTodo,
} from '../controllers/todo.js';

const router = new Router();

router.prefix('/api/todo');

router.get('/', async (ctx) => {
  const result = await getTodos(ctx.request.query);
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Todo', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createTodo(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Todo', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyTodo(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', genValidator('NeedId', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteTodo(id);
  ctx.body = result;
});

export default router;
