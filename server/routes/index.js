import Router from 'koa-router';

/**
 * 页面 、 静态资源、api 404
 * @param {Object} viteServer
 */
const setRouter = async (viteServer) => {
  const router = new Router();
  router.use('/api(.*)', async (ctx) => {
    ctx.body = 'api not found';
  });

  let server;
  if (viteServer) {
    // 开发环境
    server = await import('../utils/ssrRender.js');
  } else {
    // 正式环境
    server = await import('../utils/serverRender.js');
  }
  server = server.default;
  server(router, viteServer);

  return router;
};

export default setRouter;
