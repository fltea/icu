import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from 'vue-router';

import routes from './routes';

export const createRouter = (type) => createVueRouter({
  history: type === 'client' ? createWebHistory() : createMemoryHistory(),
  routes,
});
