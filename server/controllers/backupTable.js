import { SuccessModel } from '../model/ResModel.js';
import { BACKUP_DIR } from '../conf/constant.js';
import { formatDate } from '../utils/tools.js';
import { statDir } from '../utils/files.js';
import catchError from '../utils/tcatch.js';

import { allModelKey, saveDatas, setDatas } from '../services/backupTable.js';

export function modelsKey() {
  try {
    const result = allModelKey();
    return new SuccessModel(result);
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据
 *
 */
export async function backTable(table) {
  try {
    const date = formatDate({ format: 'YYYY-mm-dd' });
    const lpath = `${BACKUP_DIR}/${date}`;
    statDir(lpath);
    await saveDatas(lpath, table);

    return new SuccessModel({
      table,
      message: '備份數據成功',
    });
  } catch (error) {
    return catchError(error);
  }
}

/**
 * 备份数据 还原
 */
export async function restoreTable({ date, table, oIds }) {
  try {
    const lpath = `${BACKUP_DIR}/${date}`;
    await setDatas({ lpath, table, oIds });
    return new SuccessModel({
      table,
      message: `数据已还原到${date}`,
    });
  } catch (error) {
    return catchError(error);
  }
}
