import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from "vue-router";

import routes from "./routes";

export const createRouter = (type) => {
  return createVueRouter({
    history: type === "client" ? createWebHistory() : createMemoryHistory(),
    routes,
  });
};
