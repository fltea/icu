const Koa = require("koa");
const fs = require("fs");
const { koaBody } = require("koa-body");
const path = require("node:path");
const vite = require("vite");

const app = new Koa();
(async () => {
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: path.join(process.cwd(), "files/temp/"), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        // onFileBegin:(name, file) => {
        //   console.log('onFileBegin',name, file)
        // }
      },
    })
  );

  // routes
  let routes = fs.readdirSync(__dirname + "/routes");
  if (routes.includes("index.js")) {
    routes = routes.filter((v) => !v.includes("index.js"));
    routes.push("index.js");
  }
  // console.log("routes", routes);
  for (let i = 0; i < routes.length; i++) {
    const fileName = routes[i];
    const route = require(`./routes/${fileName}`);
    if (!fileName.includes("index")) {
      app.use(route.routes(), route.allowedMethods());
    } else {
      const index = route(viteServer);
      app.use(index.routes(), index.allowedMethods());
    }
  }

  app.listen(3000);
})();
