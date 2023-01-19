import { createApp } from './main';
import { createRouter } from './routes';

const { app } = createApp();
const router = createRouter('client');
app.use(router);
router.isReady().then(() => {
  app.mount('#app', true);
});
