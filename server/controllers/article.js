import { addInfo, updateInfo, notExistInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import { fileToMedia } from '../utils/files.js';

import {
  articleInfo,
  articles,
  newArticle,
  changeArticle,
} from '../services/article.js';
import { newMedia } from '../services/media.js';

/**
 * 獲取單個數據
 */
export async function getArticle(id) {
  if (id) {
    const result = await articleInfo(id);
    if (result) {
      return new SuccessModel(result);
    }
  }
  return new ErrorModel(notExistInfo);
}

/**
 * 獲取列表
 */
export async function getArticles({ title, tag, content, publishDate, page, limit }) {
  const result = await articles({ title, tag, content, publishDate, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setArticle({ title, tag, content, publishDate, cover }) {
  const article = { title, tag, content, publishDate, cover };
  const result = await newArticle(article);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}

/**
 * 修改數據
 */
export async function modArticle({ id, title, tag, content, publishDate, cover }) {
  const article = { id, title, tag, content, publishDate, cover };
  const result = await changeArticle(article);
  if (result) {
    return new SuccessModel(result);
  }

  return new ErrorModel(updateInfo);
}

export async function setMedias({ file }) {
  let medias = [];
  if (file) {
    if (!Array.isArray(file)) {
      file = [file];
    }
    medias.push(...file);
  }
  if (medias.length) {
    medias = medias.map((media) => fileToMedia(media));

    let index = 0;
    while (index < medias.length) {
      const { id, url } = await newMedia(medias[index]);
      medias[index] = { id, url };
      index += 1;
    }
  }

  return new SuccessModel({
    list: medias,
  });
}
