import { schemaFileInfo } from '../model/ErrorInfos.js';
import { ErrorModel, SuccessModel } from '../model/ResModel.js';
import catchError from '../utils/tcatch.js';

import {
  doulist,
} from '../services/douban.js';

/**
 * 獲取 doulist
 */
export async function getDoulist({ id, page }) {
  try {
    if (id) {
      const result = await doulist(id, page);
      if (result) {
        return new SuccessModel(result);
      }
    }
    return new ErrorModel(schemaFileInfo);
  } catch (error) {
    return catchError(error);
  }
}
