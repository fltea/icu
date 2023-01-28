import { SuccessModel } from '../model/ResModel.js';
import { FILE_DIR } from '../conf/constant.js';
import catchError from '../utils/tcatch.js';

function filepath2url(fpath) {
  let url = fpath.split(`${FILE_DIR}`).pop();
  url = url.replace(/\\/g, '');
  url = `/${FILE_DIR}/${url}`;
  return url;
}

export function uploadFile(files) {
  try {
    const list = Object.keys(files);
    let result;
    list.forEach((key) => {
      const file = files[key];
      const url = filepath2url(file.filepath);
      const fileObj = {
        url,
        size: file.size,
        mimetype: file.mimetype,
        name: file.originalFilename,
      };
      if (!result) {
        result = fileObj;
      } else {
        result = [result, fileObj];
      }
    });
    // console.log(result);
    return new SuccessModel({ data: result });
  } catch (error) {
    return catchError(error);
  }
}
