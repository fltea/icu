import { createSSRApp } from 'vue';
import './assets/css/common.less';
import inComps from './utils/inComps';
import setDirective from './utils/setDires';
import App from './App.vue';

// createApp(App).mount('#app')
export const createApp = () => {
  const app = createSSRApp(App);

  // 自定义指令
  app.use(setDirective);
  // 全局组件
  app.use(inComps(['ComDialog', 'ComTab', 'ComList', 'ComDownButton', 'ComUploadButton', 'TextDialog']));
  return { app };
};
