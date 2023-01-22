import Koa from 'koa';
import { koaBody } from 'koa-body';
import path from 'node:path';
import fs from 'node:fs';
import * as vite from 'vite';

const app = new Koa();
const viteServer = await vite.createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(process.cwd(), 'files/temp/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      // onFileBegin:(name, file) => {
      //   console.log('onFileBegin',name, file)
      // }
    },
  }),
);

// routes
let routes = fs.readdirSync(path.join(process.cwd(), 'server/routes'));
if (routes.includes('index.js')) {
  routes = routes.filter((v) => !v.includes('index.js'));
  routes.push('index.js');
}
// console.log("routes", routes);
for (let i = 0; i < routes.length; i++) {
  const fileName = routes[i];
  let router = await import(`./routes/${fileName}`);
  router = router.default;
  // const router = require(`./routes/${fileName}`);
  // console.log('router', router);
  if (!fileName.includes('index')) {
    app.use(router.routes(), router.allowedMethods());
  } else {
    const index = router(viteServer);
    app.use(index.routes(), index.allowedMethods());
  }
}

// app.listen(9186);

// module.exports = app;
export default app;
