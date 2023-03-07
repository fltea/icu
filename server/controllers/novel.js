// import { addInfo, delInfo, updateInfo, schemaFileInfo, isExistInfo, notExistInfo } from '../model/ErrorInfos.js';
import { SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { setHashList } from '../utils/files.js';
import { getRange, formatPage, getPage } from '../utils/crawler.js';
import { novelContent, novelChapter } from '../crawler/novel.js';
import { novelList, chapterInfo, chapterAdd, chapterMod, chapterDel, novelerAdd, novelerMod, novelerInfo } from '../services/novel.js';

// 根据url获取详情
export async function getNurl({ url, encode, title, author, content, lists, detailurl, listSort, multlist, nolist }) {
  try {
    const result = await novelContent({ url, encode, title, author, content, lists, detailurl, listSort, multlist });
    console.log(nolist);
    let nextPage;
    if (result.multlist) {
      nextPage = formatPage(result.multlist, detailurl);
      nextPage = getPage(nextPage, url);
    }
    while (nextPage) {
      const nextResult = await novelContent({ url: nextPage, encode, title, author, content, lists, detailurl, listSort, multlist });
      if (nextResult.multlist) {
        nextPage = formatPage(nextResult.multlist, detailurl);
        nextPage = getPage(nextPage, url);
      }
      const nlist = nextResult.list;
      if (Array.isArray(nlist) && nlist.length) {
        result.list.push(...nlist);
      }
    }
    setHashList(url, result.list);

    if (nolist) {
      delete result.list;
    }

    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

// 获取章節
export async function getNurlChapter({ url, encode, name, detail, detailex, dstart, dend, multpage }) {
  try {
    const arange = getRange(dstart, dend);
    const result = await novelChapter({ url, encode, name, detail, detailex, arange, multpage });

    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

// 獲取列表
export async function getNovel({ title, aurthor, page, limit }) {
  try {
    const result = await novelList({ title, aurthor, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 獲取詳情
export async function getNovelById({ id }) {
  try {
    const result = await chapterInfo(id, true);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 新增
export async function setNovel({ url, title, author, content, clutter, platform, tag }) {
  try {
    let result;
    const novel = { type: 'novel', url, title, author, content, clutter, platform, tag };
    if (clutter && isNaN(clutter)) {
      const clutterInfo = JSON.parse(clutter);
      const { domain, id } = clutterInfo;
      if (id) {
        delete clutterInfo.id;
        result = await novelerMod({
          id,
          content: JSON.stringify(clutterInfo),
        });
        novel.clutter = id;
      } else if (domain) {
        // 新增clutter
        delete clutterInfo.id;
        result = await novelerAdd({
          domain,
          content: JSON.stringify(clutterInfo),
        });
        novel.clutter = result.id;
      }
    }
    result = await chapterAdd(novel);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 修改
export async function modNovel({ id, url, title, author, content, domain, clutter, platform, tag }) {
  try {
    const result = await chapterMod({ id, url, title, author, content, domain, clutter, platform, tag });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 刪除
export async function delNovel({ id }) {
  try {
    const result = await chapterDel(id);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// noveler 詳情
export async function getNoveler({ id, domain }) {
  try {
    const result = await novelerInfo({ id, domain });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// chapter 詳情
export async function getChapter({ id }) {
  try {
    const result = await chapterInfo(id);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 新增
export async function setChapter({ url, title, author, content, type = 'novel', typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag }) {
  try {
    const result = await chapterAdd({ url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
