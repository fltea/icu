import { addInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';

import {
  mlogInfo,
  mlogs,
  newMlog,
} from '../services/mlog.js';
import { fileToMedia } from '../utils/files.js';
import { newMedia } from '../services/media.js';

/**
 * 獲取單個數據
 */
export async function getMlog(id) {
  const result = await mlogInfo(id);
  return new SuccessModel(result);
}

/**
 * 獲取列表
 */
export async function getMlogs({ text, page, limit }) {
  const result = await mlogs({ text, page, limit });
  return new SuccessModel(result);
}

/**
 * 創建數據
 */
export async function setMlog({ text }, { pics, video }) {
  // console.log(text, pics);
  let medias = [];
  if (video) {
    medias = [video].map((pic) => fileToMedia(pic));
  } else if (pics) {
    if (!Array.isArray(pics)) {
      pics = [pics];
    }
    medias = pics.map((pic) => fileToMedia(pic));
  }
  if (medias.length) {
    let index = 0;
    while (index < medias.length) {
      const { id, url } = await newMedia(medias[index]);
      medias[index] = { id, url };
      index += 1;
    }
  }
  // console.log(medias);
  const mlog = { text };
  if (medias.length) {
    if (video) {
      mlog.infos = JSON.stringify({
        video: medias.pop(),
      });
    } else if (pics) {
      mlog.infos = JSON.stringify({
        pics: medias,
      });
    }
  }
  const result = await newMlog(mlog);
  if (result) {
    return new SuccessModel(result);
  }
  return new ErrorModel(addInfo);
}
