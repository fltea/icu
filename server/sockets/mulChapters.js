import { errorInfo, isExistInfo, notExistInfo, schemaFileInfo } from '../model/ErrorInfos.js';
import { reqiureFile } from '../utils/files.js';
import { TEMP_DIR } from '../conf/constant.js';
import hash from '../utils/crypto.js';
import { sleep } from '../utils/tools.js';
import {
  getNovel,
  modifyNovel,
  addChapter,
  modifyChapter,
  chapterNovel,
  contentChapter,
} from '../controllers/novel.js';

const getContent = async (ws, chapter, options, isleep) => {
  const { url, title: name } = chapter;
  // 开始加载
  ws.send(JSON.stringify({
    loading: true,
    url,
  }));
  // 加载阻塞
  let sleepTime = 3 * 1000;
  if (isleep) {
    sleepTime = 5 * 1000;
  }
  await sleep(sleepTime);

  // 下载内容
  const { encode, detail, detailex, dstart, dend, multpage } = options;
  const iresult = await chapterNovel({ url, encode, name, detail, detailex, dstart, dend, multpage });
  // console.log(iresult);
  ws.send(JSON.stringify({
    code: iresult.code,
    download: iresult.code === 200,
    url,
  }));
  return iresult;
};

async function miltChapter(ws, data) {
  try {
    const params = JSON.parse(data);
    // 根据 novel 获取 novel
    const { novel, urls, isleep } = params;
    // console.log('miltChapter novel', novel, urls);
    let novelValue = await getNovel({ id: novel, clutter: true });
    if (novelValue) {
      novelValue = novelValue.data;
      let { loaded } = novelValue;
      // 根据 novel url 获取 list
      const listId = hash(novelValue.url);
      const listData = reqiureFile(`${TEMP_DIR}/${listId}`);
      const list = JSON.parse(listData).map((v) => ({
        url: v.url,
        title: v.name,
        content: '',
        author: '',
      }));

      const dataValue = JSON.parse(novelValue.Clutter.content);
      // 根据 url 获取 内容
      if (Array.isArray(urls)) {
        const max = urls.length;
        for (let i = 0; i < max; i++) {
          const url = urls[i];
          const item = list.find((v) => v.url === url);
          // 根据 url 获取 chapter
          const iresult = await contentChapter(item);
          if (iresult && iresult.data.content) {
            ws.send(JSON.stringify({
              ...isExistInfo,
              url,
            }));
          } else {
            const ichapter = await getContent(ws, item, dataValue, isleep);
            // 更新 chapter 或新增
            let result;
            const { title } = item;
            if (iresult) {
              result = await modifyChapter({ id: iresult.data.id, content: ichapter.data.detail || '' });
            } else {
              result = await addChapter({ url, title, novel, content: ichapter.data.detail || '', author: '' });
              loaded += 1;
              modifyNovel({
                id: novel,
                loaded,
              });
            }
            ws.send(JSON.stringify({
              url,
              title,
              content: ichapter.data.detail,
              add: result.code === 200,
            }));
          }
        }
        ws.send(JSON.stringify({
          finished: true,
        }));
      } else {
        ws.send(JSON.stringify(schemaFileInfo));
      }
    } else {
      ws.send(JSON.stringify(notExistInfo));
    }
  } catch (error) {
    ws.send(JSON.stringify(errorInfo));
  }
}

export default miltChapter;
