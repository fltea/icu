/* eslint-disable no-underscore-dangle */
import { createApp } from './main';
import { createRouter } from './routes';
import createStore from './store';

const { app } = createApp();
const router = createRouter('client');
const pinia = createStore();

app.use(router);
app.use(pinia);

// 初始化 pinia
if (window.__INITIAL_STATE__) {
  pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
}

router.isReady().then(() => {
  app.mount('#app', true);
});
