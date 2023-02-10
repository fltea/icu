# WebSocket

**双向通信**

HTML5开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。
它基于TCP传输协议，并复用HTTP的握手通道，实现了 浏览器 与 服务器 的 全双工通信（全双工通信：浏览器既可以主动给服务端发消息，服务券也可以主动给浏览器发消息）

http 是无法实现这种功能的，http 是 发送 ---> 请求流程，如果不发送请求，服务端是不能主动给浏览器发消息的

websocket 是一种持久协议（长链接），http是非持久协议（每次服务器发送一个对象后相关的TCP连接就被关闭，也就是说每个连接没有持续到可以传输其他对象。每个TCP连接只能传送一个请求消息和响应消息）

## koa

`ws - npm`
> https://github.com/websockets/ws

> http://www.npmdoc.org/wszhongwenwendangws-jszhongwenjiaochengjiexi.html

``` js
// ws 示例 :
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';

const server = createServer({
  cert: readFileSync('/path/to/cert.pem'),
  key: readFileSync('/path/to/key.pem')
});
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(8080);
 
```

new Koa() 返回 app在app.listen(port) 返回值是一个Server，可用于`new WebSocketServer({ server })`。

> WebSocketServer会首先判断请求是不是WS请求，如果是，它将处理该请求，如果不是，该请求仍由koa处理。
> 所以，WS请求会直接由WebSocketServer处理，它根本不会经过koa，koa的任何middleware都没有机会处理该请求。

## web

> https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/WebSocket

### websocket 跟 socket 的区别

软件通信有七层结构，下三层结构偏向与数据通信，上三层更偏向于数据处理，中间的传输层则是连接上三层与下三层之间的桥梁，每一层都做不同的工作，上层协议依赖与下层协议。基于这个通信结构的概念。

Socket 其实并不是一个协议，是应用层与 TCP/IP 协议族通信的中间软件抽象层，它是一组接口。当两台主机通信时，让 Socket 去组织数据，以符合指定的协议。TCP 连接则更依靠于底层的 IP 协议，IP 协议的连接则依赖于链路层等更低层次。

WebSocket 则是一个典型的应用层协议。

总的来说：Socket 是传输控制层协议，WebSocket 是应用层协议。

``` js
  const ws = new WebSocket(`ws://localhost:9099/xxxx`);
  ws.onopen = () => {
    // Web Socket 已连接上，使用 send() 方法发送数据
    ws.send('发送数据');
    console.log(new Date(), '数据发送中...');
  };

  ws.onmessage = (evt) => {
    // const msg = evt.data;
    console.log(new Date(), '数据已接收...', evt);
  };

  ws.onclose = () => {
    // 关闭 websocket
    console.log(new Date(), '连接已关闭...');
  };

  // 浏览器 路由跳转 刷新 关闭 会自动关闭
  // window.onbeforeunload = function() {
  //   ws.onclose = function () {}; // disable onclose handler first
  //   ws.close()
  // };
```

## 流程

1. 服务器端接入 websoketserver
  监听connection

1. 客户端 生成 websoket 开始长链接

1. 服务器端监听到 connection
   设置，操作数据，返回数据到客户端

1. 客户端接收数据

> 客户端 close 关闭
> 服务器端 close 关闭
> 其他断线情况

ping/pong works as specified in the RFC.
An endpoint can send a ping frame via ws.ping() at any time after the connection is established.
Upon receipt of a ping frame, an endpoint sends a pong frame in response which triggers the pong event.

Using this one can implement a heartbeat system to check if the connection is still alive.

``` js
    ws.ping('ping function');

    ws.on('pong', () => {
      console.log('pong function listen', +new Date(), ws.readyState);
    });
```
