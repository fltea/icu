import { schemaFileInfo, isExistInfo } from '../model/ErrorInfos.js';
import { reqiureFile } from '../utils/files.js';
import { TEMP_DIR } from '../conf/constant.js';
import { sleep } from '../utils/tools.js';
import {
  chapterNovel,
  contentChapter,
  addChapter,
  modifyNovel,
} from '../controllers/novel.js';

const setChapter = async (ws, options, chapter) => {
  const { url, title: name } = chapter;
  // 开始加载
  ws.send(JSON.stringify({
    loading: true,
    url,
    name,
  }));
  // 加载阻塞 5秒
  await sleep(5 * 1000);

  // 下载内容
  const { encode, detail, detailex, dstart, dend, multpage, novel } = options;
  let iresult = await chapterNovel({ url, encode, name, detail, detailex, dstart, dend, multpage });
  iresult = {
    code: iresult.code,
    download: iresult.code === 200,
    url,
    name,
  };
  ws.send(JSON.stringify(iresult));

  // 插入数据库
  iresult = await addChapter({ url, title: name, novel, content: iresult.detail || '', author: '' });
  iresult = Object.assign(iresult, {
    url,
    name,
    add: iresult.code === 200,
  });
  ws.send(JSON.stringify(iresult));
};

const saveNovel = async (ws, data) => {
  try {
    const params = JSON.parse(data);
    // console.log('saveNovel', params);

    // 先保存
    const { listId, loaded, novel } = params;
    let curIndex = +loaded || 0;
    if (!listId) {
      ws.send(JSON.stringify(schemaFileInfo));
      return;
    }
    let list = reqiureFile(`${TEMP_DIR}/${listId}`);
    list = JSON.parse(list).map((v) => ({
      url: v.url,
      title: v.name,
      content: '',
      author: '',
    }));

    // 获取内容更新
    const datas = list.slice(curIndex);
    if (datas.length) {
      let max = datas.length;
      while (max) {
        // console.log('max', max);
        const item = datas.shift();
        max = datas.length;
        const iresult = await contentChapter(item);
        if (iresult.code === 200) {
          ws.send(JSON.stringify({
            ...isExistInfo,
            ...item,
          }));
        } else {
          await setChapter(ws, params, item);
        }
        curIndex += 1;
      }
      modifyNovel({
        id: novel,
        loaded: curIndex,
      });
    }

    ws.send(JSON.stringify({
      finished: true,
    }));
  } catch (error) {
    ws.send(JSON.stringify(schemaFileInfo));
  }
};

export default saveNovel;
