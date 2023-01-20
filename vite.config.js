import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 设置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // less 全局变量
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve(__dirname, 'src/assets/css/var.less')}"`,
        },
      },
    },
  },
  plugins: [vue()],
  server: {
    watch: {
      // 忽略文件变化
      ignored: ['**/files/**', '**/server/**', '**/test/**'],
    },
  },
});
