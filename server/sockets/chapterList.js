import { schemaFileInfo } from '../model/ErrorInfos.js';
import { randInt } from '../utils/tools.js';

import {
  getNurlChapter,
  getNovelById,
  setChapter,
} from '../controllers/novel.js';

async function chapterContent(ws, curls, errcount, index, clutter, typeId) {
  if (ws.readyState !== 1) {
    console.log('chapterContent: ws is closed');
    return;
  }
  const item = curls[index];
  if (!item) {
    return;
  }
  let errCount = errcount;
  const { url, title, serial } = item;
  // 开始加载
  ws.send(JSON.stringify({
    loading: true,
    url,
  }));
  console.log('loading', title, url);
  let result = await getNurlChapter({ ...clutter, title, url });
  if (!result.data || result.code !== 200) {
    if (result.code !== 1000) {
      errCount += 1;
    }
    ws.send(JSON.stringify({ ...result, url, errCount }));
    // 错误太多次
    if (errCount >= 3) {
      return;
    }
    // 请求超时 30秒后重新请求
    if (result.code === 10003) {
      console.log('setTimeout sleepTime', 30 * 1000);
      setTimeout(() => {
        chapterContent(ws, curls, errCount, index, clutter, typeId);
      }, 30 * 1000);
      return;
    }
  } else {
    const { detail } = result.data;
    // console.log(detail);
    // console.log('setChapter', title, url);
    result = await setChapter({
      title,
      typeId,
      clutter: clutter.id,
      url,
      content: detail,
      serial,
    });
    ws.send(JSON.stringify(result));
  }

  // 加载阻塞
  if (index < (curls.length - 1)) {
    let sleepTime;
    if (index && !(index % 3)) {
      sleepTime = randInt(5);
    }
    if (clutter.issleep) {
      let adder = +clutter.issleep;
      if (isNaN(adder) || adder < 3) {
        adder = 3;
      }
      sleepTime = randInt(adder + 5, adder + 10);
    }
    if (sleepTime) {
      console.log(index, 'sleepTime', sleepTime);
      setTimeout(() => {
        chapterContent(ws, curls, errCount, index + 1, clutter, typeId);
      }, sleepTime * 1000);
    } else {
      chapterContent(ws, curls, errCount, index + 1, clutter, typeId);
    }
  }
}

async function chapterList(ws, data) {
  const params = JSON.parse(data);
  const { novelId, urls } = params;
  // 非数组
  if (!Array.isArray(urls)) {
    ws.send(JSON.stringify(schemaFileInfo));
    return;
  }

  let novelValue = await getNovelById({ id: novelId });
  // 无 novel
  if (novelValue.code !== 200) {
    ws.send(JSON.stringify(novelValue));
    return;
  }
  novelValue = novelValue.data;
  const { clutter, chapters } = novelValue;
  const curls = [];
  chapters.forEach((item, i) => {
    if (!item.id && urls.includes(item.url)) {
      curls.push({
        ...item,
        serial: i,
      });
    }
  });
  console.log('loading', novelValue.title);
  chapterContent(ws, curls, 0, 0, clutter, novelValue.id);
}

export default chapterList;
