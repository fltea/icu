import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { setHashList, getHashList } from '../utils/files.js';
import { getRange, formatPage, getPage } from '../utils/crawler.js';
import { novelContent, novelChapter } from '../crawler/novel.js';
import { addInfo, delInfo, notExistInfo, updateInfo } from '../model/ErrorInfos.js';
import { changeMedia, deleteMedia, mediaInfo, medias, newMedia } from '../services/media.js';
import { chaptersByMedia, chapterInfo, sortChapters, changeChapter, newChapter } from '../services/chapter.js';
import { changeClutter, clutterInfo, newClutter } from '../services/clutter.js';

// 根据url获取详情
export async function getNurl({ url, encode, title, author, content, lists, detailurl, listSort, multlist, nolist, puppeteer }) {
  try {
    if (!detailurl) {
      detailurl = url;
    }
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
export async function getNovel({ title, author, page, limit }) {
  try {
    const result = await medias({ type: 'novel', title, author, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
// 獲取詳情
export async function getNovelInfo({ id }) {
  try {
    const result = await mediaInfo(id);

    if (result) {
      const { rows, count } = await chaptersByMedia(id);
      const chapters = getHashList(result.url) || [];
      const diffs = chapters.filter((v) => !rows.find((c) => c.url === v.url));
      result.chapters = [...rows, ...diffs];
      result.chapterCount = count;

      if (result.clutter) {
        const clutter = await clutterInfo({ id: result.clutter });
        result.clutter = clutter;
      }

      return new SuccessModel(result);
    }

    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 新增
async function setClutter(novel) {
  const { clutter } = novel;
  let result;
  if (clutter && isNaN(clutter)) {
    const data = JSON.parse(clutter);
    const { domain, id } = data;
    if (id) {
      delete data.id;
      result = await changeClutter({
        id,
        content: JSON.stringify(data),
      });
      novel.clutter = id;
    } else if (domain) {
      // 新增clutter
      delete data.id;
      result = await newClutter({
        type: 'noveler',
        phrase: domain,
        content: JSON.stringify(data),
      });
      novel.clutter = result.id;
    }
  }
}
export async function setNovel({ url, title, creator, abstract, clutter, finished, tag }) {
  try {
    const novel = { url, type: 'novel', title, creator, abstract, clutter, finished, tag };
    await setClutter(novel);
    const result = await newMedia(novel);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 修改
export async function modNovel({ id, url, title, creator, abstract, clutter, finished, tag }) {
  try {
    const novel = { id, url, title, creator, abstract, clutter, finished, tag };
    await setClutter(novel);
    const result = await changeMedia(novel);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 刪除
export async function delNovel({ id }) {
  try {
    const result = await deleteMedia(id);
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
    const result = await clutterInfo({ id, type: 'noveler', phrase: domain });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}

// chapter 詳情
export async function getChapter({ id }) {
  try {
    const result = await chapterInfo(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}
// 新增
export async function setChapter({ url, title, author, content, media, serial, clutter, platform }) {
  try {
    const chapter = { url, title, author, content, media, serial, clutter, platform };
    const result = await newChapter(chapter);
    if (result) {
      return new SuccessModel(result);
    }

    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function modChapter({ id, title, author, content, platform }) {
  try {
    const result = await changeChapter({ id, title, author, content, platform });
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
    const result = await sortChapters(sorts);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}
