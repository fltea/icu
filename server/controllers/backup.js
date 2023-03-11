import { notExistInfo } from '../model/ErrorInfos.js';
import { SuccessModel, ErrorModel } from '../model/ResModel.js';
import { BACKUP_DIR } from '../conf/constant.js';
import { formatDate } from '../utils/tools.js';
import { getFiles, statDir } from '../utils/files.js';
import catchError from '../utils/tcatch.js';

import { saveDatas, setDatas } from '../services/backup.js';

/**
 * 备份数据
 *
 */
export async function backupDatas() {
  try {
    const date = formatDate({ format: 'YYYY-mm-dd' });
    const lpath = `${BACKUP_DIR}/${date}`;
    statDir(lpath);
    await saveDatas(lpath);

    return new SuccessModel({
      message: '備份數據成功',
    });
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据 还原
 */
export async function restoreDatas({ date }) {
  try {
    const result = await setDatas(date);
    const hasData = result.some((v) => !!v);
    if (hasData) {
      return new SuccessModel({
        message: `数据已还原到${date}`,
      });
    }

    return new ErrorModel(notExistInfo);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据列表
 */
export async function backups() {
  try {
    const list = getFiles(BACKUP_DIR);
    return new SuccessModel(list);
  } catch (error) {
    return catchError(error);
  }
}
