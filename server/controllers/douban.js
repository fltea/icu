import { schemaFileInfo, updateInfo, addInfo, delInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { sleep } from '../utils/tools.js';
import { setHashList } from '../utils/files.js';
import { durlist, durl, gurlist, gurl, dDetail } from '../crawler/douban.js';
import { newClutter, changeClutter, deleteClutter, clutterInfo, clutters } from '../services/clutter.js';

/**
 * 所有豆列
 */
async function durlList(url, cookie) {
  const result = await durlist(url, cookie);
  let { nextPage } = result;
  while (nextPage) {
    await sleep(3000);
    const nresult = await durlist(nextPage, cookie);
    nextPage = nresult.nextPage;
    if (nresult.list) {
      result.list.push(...nresult.list);
    }
    if (nextPage === url) {
      nextPage = '';
    }
  }
  return result;
}

/**
 * 豆列详情
 */
async function durlDetail(url, cookie, nolist) {
  const result = await durl(url, cookie);

  if (!nolist) {
    let { nextPage } = result;
    while (nextPage) {
      await sleep(3000);
      const nresult = await durl(nextPage);
      nextPage = nresult.nextPage;
      if (nresult.topics) {
        result.topics.push(...nresult.topics);
      }
      if (nextPage === url) {
        nextPage = '';
      }
    }
  }
  if (result.topics) {
    setHashList(url, result.topics);
  }
  if (nolist) {
    delete result.topics;
  }
  return result;
}

/**
 * 根据 url 获取 豆列、小组
 */
export async function getDurl({ cookie, url, nolist }) {
  try {
    let result = null;
    // 豆列
    if (url.includes('doulist')) {
      if (url.includes('doulists')) {
        result = await durlList(url, cookie);
      } else {
        result = await durlDetail(url, cookie, nolist);
      }
      return new SuccessModel(result);
    }

    // 小组
    if (url.includes('/group/')) {
      if (url.includes('group/topic/')) {
        result = await dDetail(url, cookie);
      } else {
        const urls = url.split('/');
        const index = urls.findIndex((v) => v === 'group') + 1;
        if (urls[index] === 'people' && urls.includes('joins')) {
          // 豆瓣小组列表页面
          result = await gurlist(url, cookie);
        } else {
          // 小组首页
          result = await gurl(url, cookie, nolist);
        }
      }
      return new SuccessModel(result);
    }

    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 根据 url 获取页面详情
 */
export async function getDetail({ url, cookie }) {
  try {
    const result = await dDetail(url, cookie);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 数据库操作
 */
/**
 * 获取豆列
 */
const dtype = 'doubanDoulist';
export async function getDoulist({ title, page, limit }) {
  try {
    const search = {
      type: dtype,
      content: title,
      page,
      limit,
    };
    const result = await clutters(search);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取豆列详情
 */
export async function getDoulistById({ id }) {
  try {
    const result = await clutterInfo({ id });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 新增豆列
 */
export async function setDoulist(doulist) {
  try {
    const clutter = {
      type: dtype,
      phrase: doulist.id,
      content: JSON.stringify(doulist),
    };
    const result = await newClutter(clutter);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改豆列
 */
export async function modDoulist(doulist) {
  try {
    const { clutter } = doulist;
    ['clutter', 'phrase', 'type'].forEach((key) => {
      delete doulist[key];
    });
    const item = {
      content: JSON.stringify(doulist),
      id: clutter,
    };
    const result = await changeClutter(item);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取小组
 */
const gtype = 'doubanGroup';
export async function getGroup({ name, page, limit }) {
  try {
    const search = {
      type: gtype,
      content: name,
      page,
      limit,
    };
    const result = await clutters(search);
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取小组详情
 */
export async function getGroupById({ id }) {
  try {
    const result = await clutterInfo({ id });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 新增小组
 */
export async function setGroup(group) {
  try {
    if (group.tabs) {
      group.tabs = JSON.parse(group.tabs);
    }
    if (group.tags) {
      group.tags = JSON.parse(group.tags);
    }
    const clutter = {
      type: gtype,
      phrase: group.id,
      content: JSON.stringify(group),
    };
    const result = await newClutter(clutter);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改小组
 */
export async function modGroup(group) {
  try {
    const { clutter } = group;
    ['clutter', 'phrase', 'type'].forEach((key) => {
      delete group[key];
    });
    const item = {
      content: JSON.stringify(group),
      id: clutter,
    };
    const result = await changeClutter(item);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 删除豆列/小组
 */
export async function delDouban({ clutter }) {
  try {
    const result = await deleteClutter(clutter);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}
