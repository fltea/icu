import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { setHashList, getHashList } from '../utils/files.js';
import { getRange, formatPage, getPage } from '../utils/crawler.js';
import { novelContent, novelChapter } from '../crawler/novel.js';
import { novelList, chapterInfo, chapterAdd, chapterMod, chapterDel, novelerAdd, novelerMod, novelerInfo, chapterSort } from '../services/novel.js';
import { addInfo, delInfo, notExistInfo, updateInfo } from '../model/ErrorInfos.js';

// 根据url获取详情
export async function getNurl({ url, encode, title, author, content, lists, detailurl, listSort, multlist, nolist, puppeteer }) {
  try {
    const result = await novelContent({ url, encode, title, author, content, lists, detailurl, listSort, multlist, puppeteer });
    // console.log(nolist);
    let nextPage;
    if (result.multlist) {
      nextPage = formatPage(result.multlist, detailurl);
      nextPage = getPage(nextPage, url);
    }
    while (nextPage) {
      const nextResult = await novelContent({ url: nextPage, encode, title, author, content, lists, detailurl, listSort, multlist, puppeteer });
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
export async function getNurlChapter({ url, encode, name, detail, detailurl, detailex, dstart, dend, multpage, puppeteer }) {
  try {
    const arange = getRange(dstart, dend);
    const result = await novelChapter({ url, encode, name, detail, detailex, arange, multpage, puppeteer });

    let nextPage;
    if (result.multpage) {
      nextPage = formatPage(result.multpage, detailurl);
      nextPage = getPage(nextPage, url);
    }
    while (nextPage && nextPage.includes('_')) {
      const nextResult = await novelChapter({ url: nextPage, encode, name, detail, detailex, arange, multpage, puppeteer });
      if (nextResult.multpage) {
        nextPage = formatPage(nextResult.multpage, detailurl);
        nextPage = getPage(nextPage, url);
      }
      if (nextResult.detail) {
        result.detail += nextResult.detail;
      }
    }

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
    const result = await chapterInfo({ id, novel: true });
    let chapters = getHashList(result.url) || [];
    chapters = chapters.filter((v) => !result.chapters.find((c) => c.url === v.url));
    if (chapters.length) {
      result.chapters.push(...chapters);
    }

    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 新增
async function setClutter(novel) {
  const { clutter } = novel;
  let result;
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
}
export async function setNovel({ url, title, author, content, clutter, platform, tag }) {
  try {
    const novel = { type: 'novel', url, title, author, content, clutter, platform, tag };
    await setClutter(novel);
    const result = await chapterAdd(novel);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 修改
export async function modNovel({ id, url, title, author, content, clutter, platform, tag }) {
  try {
    const novel = { id, url, title, author, content, clutter, platform, tag };
    await setClutter(novel);
    const result = await chapterMod(novel);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 刪除
export async function delNovel({ id }) {
  try {
    const result = await chapterDel(id);
    if (result) {
      return new SuccessModel({
        message: '删除成功',
      });
    }
    return new ErrorModel(delInfo);
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
    const result = await chapterInfo({ id, slide: true });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 新增
export async function setChapter({ url, title, author, content, type = 'novel', typeId, serial, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag }) {
  try {
    const chapter = { url, title, author, content, type, typeId, serial, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag };
    const result = await chapterAdd(chapter);
    if (result) {
      return new SuccessModel(result);
    }

    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function modChapter({ id, title, author, content, authorId, authorLink, platform, authorIp, platformId, publishTime, tag }) {
  try {
    const chapter = { id, title, author, content, authorId, authorLink, platform, authorIp, platformId, publishTime, tag };
    const result = await chapterMod(chapter);
    if (result) {
      return new SuccessModel(result);
    }

    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function sortChapter({ sort }) {
  try {
    const sorts = [];
    sort.split(',').forEach((v) => {
      const vals = v.split(':');
      sorts.push({
        id: +vals.shift(),
        serial: +vals.pop(),
      });
    });
    // console.log(sorts);
    const result = await chapterSort(sorts);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
