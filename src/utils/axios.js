import axios from 'axios';
// import { showMessage } from './errMsg'; // 引入状态码文件

// 设置接口超时时间
axios.defaults.timeout = 60000;

// 请求地址，这里是动态赋值的的环境变量，下一篇会细讲，这里跳过
// @ts-ignore
// axios.defaults.baseURL = import.meta.env.VITE_API_DOMAIN;
try {
  if (process) {
    // 服务器端
    const { NODE_PORT } = process.env;
    axios.defaults.baseURL = `http://127.0.0.1:${NODE_PORT}`;
  }
} catch (error) {
  console.log('is CLIENT');
}

const service = axios.create();
// http request 拦截器
service.interceptors.request.use(
  (config) => {
    // 配置请求头
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded', // 传参方式表单
      // 'Content-Type':'application/json;charset=UTF-8',        // 传参方式json
      // 'token':'80c483d59ca86ad0393cf8a98416e2a1'              // 这里自定义配置，这里传的是token
    };
    // config.data = qs.stringify(config.data);
    return config;
  },
  (error) => Promise.reject(error),
);

// http response 拦截器
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('error', error);
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      // showMessage(response.status); // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data);
    }
    console.log('网络连接异常,请稍后再试!');
    return Promise.reject(error);
  },
);
service.all = axios.all;

export default service;
