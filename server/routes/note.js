import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  // getNote,
  getNotes,
  createNote,
  // createNotes,
  modifyNote,
  deleteNote,
} from '../controllers/note.js';

const router = new Router();

router.prefix('/api/note');

router.get('/', async (ctx) => {
  const result = await getNotes({});
  // console.log(result)
  ctx.body = result;
});
// router.get('/:id', async (ctx) => {
//   const result = await getPics({});
//   // console.log(result)
//   ctx.body = result;
// });

router.post('/add', genValidator('Note', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createNote(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Note', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyNote(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteNote(id);
  ctx.body = result;
});

export default router;
