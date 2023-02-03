import * as vite from 'vite';

const viteServer = await vite.createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});

export default viteServer;
