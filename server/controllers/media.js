import { addInfo, delInfo, notExistInfo, updateInfo, uploadInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import { changeMedia, deleteMedia, mediaInfo, medias, newMedia } from '../services/media.js';
import { downSource, renameFile } from '../utils/files.js';
import catchError from '../utils/tcatch.js';

export async function getMedias({ title, abstract, type, creator, channel, tag, page, limit }) {
  try {
    const result = await medias({ title, abstract, type, creator, channel, tag, page, limit });
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

export async function getMediaInfo({ id }) {
  try {
    const result = await mediaInfo(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function setMedia({ url, title, abstract, clutter, type, creator, staff, isbn, finished, price, channel, publishDate, tag, remark }) {
  try {
    const result = await newMedia({ url, title, abstract, clutter, type, creator, staff, isbn, finished, price, channel, publishDate, tag, remark });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function modMedia({ id, url, title, abstract, clutter, type, creator, staff, isbn, finished, price, channel, publishDate, tag, remark }) {
  try {
    const result = await changeMedia({ id, url, title, abstract, clutter, type, creator, staff, isbn, finished, price, channel, publishDate, tag, remark });
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(updateInfo);
  } catch (error) {
    return catchError(error);
  }
}
export async function delMedia({ id }) {
  try {
    const result = await deleteMedia(id);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(delInfo);
  } catch (error) {
    return catchError(error);
  }
}

export async function updateMedia({ file, url }) {
  try {
    if (!(file || url)) {
      return new ErrorModel(uploadInfo);
    }
    const media = {};
    if (url) {
      let name;
      name = url.split('?').shift();
      name = name.split('/').pop();
      const fpath = await downSource(url, `media/${name}`);
      if (!fpath) {
        return new ErrorModel(uploadInfo);
      }
      media.url = fpath;
      media.title = name;
      media.remark = url;
      media.type = 'url-down';
    } else {
      const { mimetype = '', originalFilename, filepath = '', newFilename } = file;
      const type = mimetype.split('/').shift();
      const newPath = filepath.replace('files', 'files\\media');
      renameFile(filepath, newPath);
      media.url = `/files/media/${newFilename}`;
      media.type = type;
      media.title = originalFilename;
    }
    const result = await newMedia(media);
    if (result) {
      return new SuccessModel(result);
    }
    return new ErrorModel(addInfo);
  } catch (error) {
    return catchError(error);
  }
}
