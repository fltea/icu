import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import { createRouter } from './routes';
import createStore from './store';

export const render = async (ctx) => {
  const { app } = createApp();
  const router = createRouter('server');
  const pinia = createStore();

  app.use(router);
  // console.log('path', ctx.path);
  await router.push(ctx.path);
  await router.isReady();

  app.use(pinia);
  const state = JSON.stringify(pinia.state.value);

  const renderCtx = {};

  const renderHtml = await renderToString(app, renderCtx);

  return [renderHtml, state];
};
