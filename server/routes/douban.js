import Router from 'koa-router';

import {
  getDurl,
  getDetail,
  getDetails,
  createSource,
// getDoulistList,
// saveDoulistList,
} from '../controllers/douban.js';

const router = new Router();

router.prefix('/api/douban');

// 爬虫数据
// 根据url获取豆列/小组/豆列/小组详情
router.post('/durl', async (ctx) => {
  const result = await getDurl(ctx.request.body);
  ctx.body = result;
});
// 根据url获取豆列/小组详情
router.post('/durl/list', async (ctx) => {
  const result = await getDurl(ctx.request.body);
  ctx.body = result;
});
// 获取详情
router.post('/durl/detail', async (ctx) => {
  const result = await getDetail(ctx.request.body);
  ctx.body = result;
});

// 数据库操作
// 获取豆列
router.get('/doulist', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  // const result = await getDetail(ctx.request.body);
  ctx.body = 'result';
});
// 获取豆列详情
router.get('/doulist/:id', async (ctx) => {
  // const result = await saveDoulistList(ctx.request.body);
  ctx.body = 'result';
});
// 新增豆列
router.post('/doulist/add', async (ctx) => {
  // const result = await saveDoulistList(ctx.request.body);
  ctx.body = 'result';
});
// 修改豆列
router.post('/doulist/modify', async (ctx) => {
  // const result = await saveDoulistList(ctx.request.body);
  ctx.body = 'result';
});

// 新增小组
router.post('/group/add', async (ctx) => {
  // const result = await saveDoulistList(ctx.request.body);
  ctx.body = 'result';
});
// 修改小组
router.post('/group/modify', async (ctx) => {
  // const result = await saveDoulistList(ctx.request.body);
  ctx.body = 'result';
});
// 操作

// 广播 日记 小组讨论 详情
// 书影音 详情

router.post('/details', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDetails(ctx.request.body);
  ctx.body = result;
});

router.post('/save', async (ctx) => {
  const result = await createSource(ctx.request.body);
  // console.log(result);
  ctx.body = result;
});

export default router;
