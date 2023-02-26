import Router from 'koa-router';

import {
  getDurl,
  getDetail,
  // getDoulist,
  getDetails,
  createSource,
// getDoulistList,
// saveDoulistList,
} from '../controllers/douban.js';

const router = new Router();

router.prefix('/api/douban');

// 根据url获取豆列
router.post('/durl', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDurl(ctx.request.body);
  ctx.body = result;
});
// 获取详情
router.post('/detail', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  const result = await getDetail(ctx.request.body);
  ctx.body = result;
});
// 获取豆列
router.get('/doulist', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  // const result = await getDetail(ctx.request.body);
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
// 获取豆列的文章
router.post('/doulist/list', async (ctx) => {
  // const result = await saveDoulistList(ctx.request.body);
  ctx.body = 'result';
});

// 根据url获取所有的小组
router.post('/gurl', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  // const result = await getDoulist(ctx.request.body);
  ctx.body = 'result';
});
// 获取小组
router.get('/group', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  // const result = await getDoulist(ctx.request.body);
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
// 小组的文章
router.post('/group/list', async (ctx) => {
  // console.log('ctx.request.body ', ctx.request.body);
  // const result = await getDoulist(ctx.request.body);
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
