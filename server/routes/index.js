const router = require("koa-router")();
const koaConnect = require("koa-connect");
const sendFile = require("koa-send");
const { resolve } = require("node:path");
const fs = require("fs");

/**
 * 页面 、 静态资源、api 404
 * @param {Object} viteServer
 */
const setRouter = (viteServer) => {
  router.use("/api(.*)", async (ctx, next) => {
    ctx.body = "api not found";
  });

  router.get(
    "/(.*)",
    koaConnect(viteServer.middlewares),
    async (ctx, next) => {
      // 请求的是静态资源
      const pathArr = ctx.path.split("/");
      const lastPath = pathArr.pop();
      if (lastPath.includes(".")) {
        const root = `${process.cwd()}/${pathArr.length === 1 ? "public" : ""}`;
        console.log("isStatic ctx.path", ctx.path, root);
        ctx.attachment(ctx.path);
        await sendFile(ctx, ctx.path, { root });
      } else {
        await next();
      }
    },
    async (ctx, next) => {
      // serve index.html - we will tackle this next
      try {
        // 1. 获取index.html
        let template = fs.readFileSync(resolve(process.cwd(), "index.html"), "utf-8");

        // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
        template = await viteServer.transformIndexHtml(ctx.path, template);

        // 3. 加载服务器入口, vite.ssrLoadModule 将自动转换
        const { render } = await viteServer.ssrLoadModule("/src/entry-server.js");

        //  4. 渲染应用的 HTML
        const [renderedHtml] = await render(ctx);

        const html = template.replace("<!--ssr-outlet-->", renderedHtml);

        ctx.type = "text/html";
        ctx.body = html;
      } catch (e) {
        viteServer && viteServer.ssrFixStacktrace(e);
        console.log(e.stack);
        ctx.throw(500, e.stack);
      }
      // serve index.html - we will tackle this next
      try {
        // 1. 获取index.html
        let template = fs.readFileSync(resolve(process.cwd(), "index.html"), "utf-8");

        // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
        template = await viteServer.transformIndexHtml(ctx.path, template);

        // 3. 加载服务器入口, vite.ssrLoadModule 将自动转换
        const { render } = await viteServer.ssrLoadModule("/src/entry-server.js");

        //  4. 渲染应用的 HTML
        const [renderedHtml] = await render(ctx);

        const html = template.replace("<!--ssr-outlet-->", renderedHtml);

        ctx.type = "text/html";
        ctx.body = html;
      } catch (e) {
        viteServer && viteServer.ssrFixStacktrace(e);
        console.log(e.stack);
        ctx.throw(500, e.stack);
      }
    }
  );

  return router;
};

module.exports = setRouter;
