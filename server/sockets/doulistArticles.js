import { errorInfo, isExistInfo, schemaFileInfo } from '../model/ErrorInfos.js';
import { sleep, randInt } from '../utils/tools.js';

import {
  getDetails,
} from '../controllers/douban.js';

import {
  getArticles,
  modifyArticle,
  createArticle,
} from '../controllers/article.js';

async function doulistArticles(ws, data) {
  try {
    const params = JSON.parse(data);
    const { clutter, list } = params;
    // urls 获取内容
    if (Array.isArray(list)) {
      const max = list.length;
      for (let i = 0; i < max; i++) {
        const link = list[i];
        let result = await getArticles({
          link,
        });
        const article = result.list.pop();
        if (article && article.content) {
          ws.send(JSON.stringify({
            ...isExistInfo,
            link,
          }));
        } else {
          // 开始加载
          ws.send(JSON.stringify({
            loading: true,
            link,
          }));
          if (i) {
            // 加载阻塞
            const scale = randInt(5, 10);
            await sleep(scale * 1000);
          }
          result = await getDetails({
            url: link,
          });
          ws.send(JSON.stringify({
            code: result.code,
            download: result.code === 200,
            link,
          }));

          const {
            title,
            content,
            author,
            publishDate,
            tag,
          } = result.data;

          // 插入数据库
          if (article) {
            result = await modifyArticle({
              id: article.id,
              title,
              content,
              author,
              publishDate,
              tag,
            });
          } else {
            result = await createArticle({
              title,
              content,
              author,
              publishDate,
              tag,
              link,
              clutter,
              platform: 'douban',
            });
          }
          ws.send(JSON.stringify({
            link,
            title,
            content,
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
  } catch (error) {
    ws.send(JSON.stringify(errorInfo));
  }
}

export default doulistArticles;
