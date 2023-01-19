import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import { createRouter } from './routes';

export const render = async (ctx) => {
  const { app } = createApp();
  const router = createRouter('server');

  app.use(router);
  console.log('path', ctx.path);
  await router.push(ctx.path);
  await router.isReady();

  const renderCtx = {};

  const renderHtml = await renderToString(app, renderCtx);

  return [renderHtml];
};
