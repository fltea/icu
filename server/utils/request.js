import http from 'node:http';
import https from 'node:https';
import { Buffer } from 'node:buffer';
import zlib from 'node:zlib';
import iconv from 'iconv-lite';

/**
 *
 * @param { String } url 请求地址
 * @param { String } method 请求方法
 * @param { Object } data 请求数据
 * @param { Object } header 请求头配置
 * @param { Boolean } media 媒体文件
 * @param { String } encode 编码
 */

const request = ({
  url,
  method = 'POST',
  data,
  header = {},
  media,
  encode = 'utf8',
  timeout,
}) => new Promise((resolve, reject) => {
  let server;
  // 协议
  const protal = url.split(':').shift();
  switch (protal) {
    case 'https':
      server = https;
      break;
    case 'http':
      server = http;
      break;

    default:
      reject(new Error('error: not https or http!'));
  }

  let headers = {};
  let datas = '';
  if (data && typeof data === 'object') {
    datas = JSON.stringify(data);
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': datas.length,
    };
    method = 'POST';
  }
  headers = Object.assign(headers, header);
  const options = {
    method,
    headers,
  };
  const req = server.request(url, options, (res) => {
    const values = [];
    if (media) {
      res.setEncoding('binary');
    }
    res.on('data', (chunk) => {
      values.push(chunk);
    });

    res.on('end', () => {
      // console.log('values', values);
      const isGzip = res.headers['content-encoding'] === 'gzip';
      if (media) {
        resolve(values.join(''));
      } else if (isGzip) {
        const buffer = Buffer.concat(values);
        zlib.gunzip(buffer, (err, decoded) => {
          const text = iconv.decode(decoded, encode);
          resolve(text);
        });
      } else if (encode) {
        const text = iconv.decode(Buffer.concat(values), encode);
        resolve(text);
      } else {
        let text = Buffer.from(values.join(''));
        text = text.toString();
        resolve(text);
      }
    });
  });
  let timenum = +timeout;
  if (isNaN(timenum)) {
    timenum = 60 * 1000;
  }
  req.setTimeout(timenum, function to() {
    const e = new Error(`http request timeout url:${url}`);
    e.code = 'ESOCKETTIMEDOUT';
    e.connect = false;
    this.abort();
    this.emit('error', e);
  }.bind(req));
  req.on('error', (error) => {
    // console.error('request error', error);
    reject(error);
  });

  if (datas) {
    req.write(datas);
  }
  req.end();
});

export default request;
