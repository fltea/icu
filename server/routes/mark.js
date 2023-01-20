import Router from 'koa-router';
import validate from '../validator/index.js';
import genValidator from '../middlewares/validator.js';

import {
  getMarks,
  createMark,
  createMarks,
  modifyMark,
  deleteMark,
  exportMarks,
} from '../controllers/mark.js';

const router = new Router();

router.prefix('/api/mark');

router.get('/', async (ctx) => {
  const result = await getMarks({});
  // console.log(result)
  ctx.body = result;
});

router.post('/upload', async (ctx) => {
  // console.log('ctx.request.files ',ctx.request.files);
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createMarks(ctx.request.files);
  ctx.body = result;
});
router.post('/add', genValidator('Mark', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await createMark(ctx.request.body);
  ctx.body = result;
});
router.post('/modify', genValidator('Mark', validate), async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await modifyMark(ctx.request.body);
  ctx.body = result;
});
router.post('/delete', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const { id } = ctx.request.body;
  const result = await deleteMark(id);
  ctx.body = result;
});
router.post('/exports', async (ctx) => {
  const result = await exportMarks();
  if (!result.errno) {
    // 设置content-type请求头
    ctx.set('Content-Type', 'text/html; charset=utf-8;');
    // 设置文件名信息请求头
    ctx.set('Content-Disposition', 'attachment; filename=Bookmarks.html');
    // 文件名信息由后端返回时必须设置该请求头,否则前端拿不到Content-Disposition响应头信息
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
  }
  ctx.body = result;
});

// module.exports = router;
export default router;
