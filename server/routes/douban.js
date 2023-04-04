import Router from 'koa-router';

import {
  getDurl,
  getDetail,
  getDoulist,
  getDoulistById,
  setDoulist,
  modDoulist,
  getGroup,
  getGroupById,
  setGroup,
  modGroup,
  delDouban,
} from '../controllers/douban.js';

const router = new Router();

router.prefix('/api/douban');

// 爬虫数据
// 根据url获取豆列/小组/豆列/小组详情
router.post('/durl', async (ctx) => {
  const result = await getDurl(ctx.request.body);
  ctx.body = result;
});
// 获取 广播 日记 小组讨论 书影音 详情
router.post('/durl/detail', async (ctx) => {
  const result = await getDetail(ctx.request.body);
  ctx.body = result;
});

// 数据库操作
// 获取豆列
router.get('/doulist', async (ctx) => {
  const result = await getDoulist(ctx.request.query);
  ctx.body = result;
});
// 获取豆列详情
router.get('/doulist/:id', async (ctx) => {
  const result = await getDoulistById(ctx.request.params);
  ctx.body = result;
});
// 新增豆列
router.post('/doulist/add', async (ctx) => {
  const result = await setDoulist(ctx.request.body);
  ctx.body = result;
});
// 修改豆列
router.post('/doulist/modify', async (ctx) => {
  const result = await modDoulist(ctx.request.body);
  ctx.body = result;
});

// 获取小组
router.get('/group', async (ctx) => {
  // console.log('ctx.request.query ', ctx.request.query);
  const result = await getGroup(ctx.request.query);
  ctx.body = result;
});
// 获取小组详情
router.get('/group/:id', async (ctx) => {
  const result = await getGroupById(ctx.request.params);
  ctx.body = result;
});
// 新增小组
router.post('/group/add', async (ctx) => {
  const result = await setGroup(ctx.request.body);
  ctx.body = result;
});
// 修改小组
router.post('/group/modify', async (ctx) => {
  const result = await modGroup(ctx.request.body);
  ctx.body = result;
});

// 删除
router.post('/del', async (ctx) => {
  const result = await delDouban(ctx.request.body);
  ctx.body = result;
});

export default router;
