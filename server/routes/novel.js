import Router from 'koa-router';
import { getNurl, getNurlChapter, getNovel, getNovelById, setNovel, modNovel, delNovel, getNoveler, getChapter, setChapter, modChapter, sortChapter } from '../controllers/novel.js';

const router = new Router();

router.prefix('/api/novel');

// 爬虫数据
// 根据url获取详情
router.post('/nurl', async (ctx) => {
  const result = await getNurl(ctx.request.body);
  ctx.body = result;
});
// 获取章節
router.post('/nurl/chapter', async (ctx) => {
  const result = await getNurlChapter(ctx.request.body);
  ctx.body = result;
});

// 数据库操作
// 獲取列表
router.get('/', async (ctx) => {
  const result = await getNovel(ctx.request.gquery);
  ctx.body = result;
});

// 獲取詳情
router.post('/detail', async (ctx) => {
  const result = await getNovelById(ctx.request.body);
  ctx.body = result;
});
// 新增
router.post('/add', async (ctx) => {
  const result = await setNovel(ctx.request.body);
  ctx.body = result;
});
// 修改
router.post('/modify', async (ctx) => {
  const result = await modNovel(ctx.request.body);
  ctx.body = result;
});
// 刪除
router.post('/del', async (ctx) => {
  const result = await delNovel(ctx.request.body);
  ctx.body = result;
});
// noveler 詳情
router.post('/noveler', async (ctx) => {
  const result = await getNoveler(ctx.request.body);
  ctx.body = result;
});
// chapter 詳情
router.post('/chapter', async (ctx) => {
  const result = await getChapter(ctx.request.body);
  ctx.body = result;
});
router.post('/chapter/add', async (ctx) => {
  const result = await setChapter(ctx.request.body);
  ctx.body = result;
});
router.post('/chapter/modify', async (ctx) => {
  const result = await modChapter(ctx.request.body);
  ctx.body = result;
});
router.post('/chapter/sort', async (ctx) => {
  const result = await sortChapter(ctx.request.body);
  ctx.body = result;
});

export default router;
