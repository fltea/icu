import Koa from 'koa';
import { koaBody } from 'koa-body';
import path from 'node:path';
import fs from 'node:fs';

import { FILE_DIR } from './conf/constant.js';
import { setEnv } from './config.js';

setEnv();
const ROOT_DIR = process.cwd();
const isPro = process.env.NODE_ENV === 'production';

const app = new Koa();
let viteServer;
if (!isPro) {
  viteServer = await import('./utils/viteServer.js');
  viteServer = viteServer.default;
}

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(ROOT_DIR, FILE_DIR), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      // onFileBegin:(name, file) => {
      //   console.log('onFileBegin',name, file)
      // }
    },
  }),
);

// routes
let routes = fs.readdirSync(path.join(ROOT_DIR, 'server/routes'));
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
    const index = await router(viteServer);
    app.use(index.routes(), index.allowedMethods());
  }
}

export default app;
