import { createSSRApp } from 'vue';
import './assets/css/common.less';
import ComDialog from '@/components/ComDialog.vue';
import App from './App.vue';

// createApp(App).mount('#app')
export const createApp = () => {
  const app = createSSRApp(App);

  app.component('ComDialog', ComDialog);
  return { app };
};
