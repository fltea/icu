import seq from './seq.js';
import './models/index.js';

// 强制删除表后重新生成
seq
  .sync({
    force: true,
  })
  .then(() => {
    console.log('seq.sync ok.');
    process.exit();
  });

// 测试连接
// seq
//   .authenticate()
//   .then(() => {
//     console.log("测试连接: ok");
//   })
//   .catch((res) => {
//     console.log("测试连接 : error", res);
//   })
//   .finally(() => {
//     // 退出
//     process.exit();
//   });
