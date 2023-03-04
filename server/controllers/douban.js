import { schemaFileInfo, addInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';
import { sleep } from '../utils/tools.js';
import { setHashList } from '../utils/files.js';
import { durlist, durl, gurlist, gurl, dDetail } from '../crawler/douban.js';
import { doulistList, createDoulist, updateDoulist, createGroup, updateGroup, groupList, doubanDelete } from '../services/douban.js';

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
async function durlDetail(url, cookie) {
  const result = await durl(url, cookie);
  let { nextPage } = result;
  while (nextPage) {
    await sleep(3000);
    const nresult = await durl(nextPage);
    nextPage = nresult.nextPage;
    if (nresult.list) {
      result.list.push(...nresult.list);
    }
    if (nextPage === url) {
      nextPage = '';
    }
  }
  if (result.list) {
    setHashList(url, result.list);
  }
  return result;
}

/**
 * 根据 url 获取 豆列、小组
 */
export async function getDurl({ cookie, url }) {
  try {
    let result = null;
    // 豆列
    if (url.includes('doulist')) {
      if (url.includes('doulists')) {
        result = await durlList(url, cookie);
      } else {
        result = await durlDetail(url, cookie);
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
        } else if (typeof +urls[index] === 'number') {
          // 小组首页
          result = await gurl(url, cookie);
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
export async function getDoulist({ title, aurthor, page, limit }) {
  try {
    const result = await doulistList({ title, aurthor, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取豆列详情
 */
export async function getDoulistById(id) {
  try {
    const result = { id };
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 新增豆列
 */
export async function setDoulist({ id, title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content }) {
  try {
    if (id) {
      const result = await createDoulist({ id, title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content });
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改豆列
 */
export async function modDoulist({ clutter, id, title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content }) {
  try {
    const result = await updateDoulist({ clutter, id, title, aurthor, aurthorIp, aurthorLink, count, createTime, updateTime, content });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取小组
 */
export async function getGroup({ name, page, limit }) {
  try {
    const result = await groupList({ name, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 获取小组详情
 */
export async function getGroupById(id) {
  try {
    const result = { id };
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 新增小组
 */
export async function setGroup({ id, name, info, content, tags }) {
  try {
    if (id) {
      const result = await createGroup({ id, name, info, content, tags });
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 修改小组
 */
export async function modGroup({ clutter, id, name, info, content, tags }) {
  try {
    const result = await updateGroup({ clutter, id, name, info, content, tags });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 删除豆列/小组
 */
export async function delDouban({ clutter }) {
  try {
    if (clutter) {
      const result = await doubanDelete({ clutter });
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}
