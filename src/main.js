import { createSSRApp } from 'vue';
import './assets/css/common.less';
import App from './App.vue';

// createApp(App).mount('#app')
export const createApp = () => {
  const app = createSSRApp(App);
  return { app };
};
