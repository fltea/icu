import WebSocket, { WebSocketServer } from 'ws';
import { Buffer } from 'node:buffer';
import { putOutInfo, errorInfo } from './model/ErrorInfos.js';

class WSS {
  static online = 0;

  static clients = {};

  static ws = WebSocketServer;

  // static isOpen(ws) {
  //   // readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
  //   const result = ws.readyState <= WebSocket.OPEN;
  //   if (result) {
  //     //  ping 一下
  //     console.log('ping', ws.readyState);
  //     ws.ping('data', '', () => {
  //       // eslint-disable-next-line prefer-rest-params
  //       console.log('ping data callback:', ws.readyState);
  //     });
  //   }
  //   return result;
  // }

  static removeWs(ws, key) {
    const client = this.clients[key];
    // console.log('close', client === ws);
    if (client === ws) {
      delete this.clients[key];
    }
  }

  static wsEvent(ws, route) {
    const path = route;
    ws.on('close', () => {
      console.log('close', path);
      this.removeWs(ws, path);
    });
    ws.on('error', (error) => {
      console.log('error', error);
      ws.close();
      this.removeWs(ws, path);
    });
    // ws.on('pong', () => {
    //   console.log('pong function listen', +new Date(), ws.readyState);
    // });
    ws.on('message', async (data) => {
      try {
      // console.log('message', data);
        const message = Buffer.from(data);
        // console.log('message', path, message.toString());
        const fpath = path.split(':').shift();
        const result = await import(`./sockets/${fpath}.js`);
        result.default(ws, message.toString());
      } catch (error) {
        console.log('error', error);
        ws.send(JSON.stringify(errorInfo));
        ws.close();
        this.removeWs(ws, path);
      }
    });
  }

  static init(server) {
    const spath = '/api/websockets';
    //  [options.path] Accept only connections matching this path
    this.ws = new WebSocketServer({ server, path: spath });
    this.ws.on('connection', (ws, request) => {
      console.log('ws connection');
      try {
        // console.log(request);
        // console.log('request.url', request.url);

        // console.log(this.ws.constructor);
        // console.log(ws.constructor);
        // eslint-disable-next-line no-underscore-dangle
        // this.online = this.ws._server._connections;

        const route = request.url.split('?').pop() || '/';
        const clients = Object.keys(this.clients);
        if (clients.includes(route)) {
          const pws = this.clients[route];
          if (pws.readyState === WebSocket.OPEN) {
            pws.send(JSON.stringify(putOutInfo));
            pws.close();
          }
        }
        this.clients[route] = ws;
        this.wsEvent(ws, route);

        // do something
        // 这里可以做一些加强判断查询数据库等行为
        // console.log(`soket 当前在线 ${clients.length} 个链接。`);

        // ws.id = id; // 添加ws实例的唯一标识
        // const obj = { message: '连接成功', retCode: 200 };
        // ws.send(JSON.stringify(obj));
      } catch (error) {
        console.log('websocket connection error', error);
        ws.close();
      }
    });
  }

  static sendToClient(Data) {
    let result = false;
    if (!(this.ws instanceof WebSocketServer)) {
      return result;
    }

    const { id } = Data;
    this.ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.id === id) {
        // 发送给指定匹配id
        client.send(JSON.stringify(Data));
        result = true;
      }
    });
    return result;
  }
}

export default WSS;
