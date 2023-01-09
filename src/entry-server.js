import { renderToString } from "vue/server-renderer";
import { createApp } from "./main";

export const render = async (ctx) => {
  const { app } = createApp();
  const renderCtx = {};

  const renderHtml = await renderToString(app, renderCtx);

  return [renderHtml];
};
