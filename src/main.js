import { createSSRApp } from 'vue';
import './assets/css/common.less';
// import ComDialog from '@/components/ComDialog.vue';
// import ComTab from '@/components/ComTab.vue';
import inComps from './utils/inComps';
import App from './App.vue';

// createApp(App).mount('#app')
export const createApp = () => {
  const app = createSSRApp(App);

  app.use(inComps(['ComDialog', 'ComTab']));
  // app.component('ComDialog', ComDialog);
  // app.component('ComTab', ComTab);
  return { app };
};
