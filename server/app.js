// import http from 'http';
import app from './server.js';

import WSS from './wss.js';

const isPro = process.env.NODE_ENV === 'production';
const Port = isPro ? 9186 : 9099;

// app.listen(Port);

// 服务器端http接口和websocket接口并存
// const server = http.createServer(app.callback());
// const wsocket = new WSS(server);
// console.log('wsocket', WSS);
// new WSS(server);
// server.listen(Port);
process.env.NODE_PORT = Port;
const server = app.listen(Port);
WSS.init(server);
