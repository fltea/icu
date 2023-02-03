import sendFile from 'koa-send';
import { resolve } from 'node:path';
import fs from 'node:fs';

// import manifest from '../../dist/client/ssr-manifest.json' assert { type:'json' };

const rootPath = process.cwd();
const rootCPath = resolve(process.cwd(), 'dist/client');

const setRouter = (router) => {
  router.get(
    '/(.*)',
    async (ctx, next) => {
      // 请求的是静态资源
      const pathArr = ctx.path.split('/');
      const lastPath = pathArr.pop();
      if (lastPath.includes('.')) {
        const isClient = pathArr.length < 2 || pathArr[1].includes('assets');
        const root = isClient ? rootCPath : rootPath;
        // console.log('isStatic ctx.path', ctx.path, root);
        ctx.attachment(ctx.path);
        await sendFile(ctx, ctx.path, { root });
      } else {
        await next();
      }
    },
    async (ctx) => {
      // serve index.html - we will tackle this next
      try {
        // 1. 获取index.html
        const template = fs.readFileSync(resolve(rootCPath, 'index.html'), 'utf-8');
        let manifest = fs.readFileSync(resolve(rootCPath, 'ssr-manifest.json'), 'utf-8');
        manifest = JSON.parse(manifest);
        // console.log(Object.keys(manifest));

        // 3. 加载服务器入口, vite.ssrLoadModule 将自动转换
        const { render } = await import('../../dist/server/entry-server.js');

        //  4. 渲染应用的 HTML
        const [renderedHtml] = await render(ctx, manifest);

        const html = template.replace('<!--ssr-outlet-->', renderedHtml);

        ctx.type = 'text/html';
        ctx.body = html;
      } catch (e) {
        console.log(e.stack);
        ctx.throw(500, e.stack);
      }
    },
  );
};

export default setRouter;
