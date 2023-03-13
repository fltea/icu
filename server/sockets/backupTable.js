import { schemaFileInfo } from '../model/ErrorInfos.js';
import { modelsKey, backTable, restoreTable } from '../controllers/backupTable.js';

async function backupTables(ws) {
  let models = modelsKey();
  if (models.code !== 200) {
    ws.send(JSON.stringify(models));
    return;
  }
  models = models.data;
  let max = models.length;
  while (max) {
    const table = models.shift();
    ws.send(JSON.stringify({
      code: 200,
      table,
      message: '开始备份',
    }));
    const result = await backTable(table);
    ws.send(JSON.stringify(result));
    max = models.length;
  }
}

async function restoreTables(ws, data) {
  const { date } = data;
  if (!date) {
    ws.send(JSON.stringify(schemaFileInfo));
    return;
  }

  let models = modelsKey();
  if (models.code !== 200) {
    ws.send(JSON.stringify(models));
    return;
  }
  models = models.data;
  let max = models.length;
  const oIds = {};
  while (max) {
    const table = models.shift();
    ws.send(JSON.stringify({
      code: 200,
      table,
      message: '开始还原数据',
    }));
    const result = await restoreTable({ date, table, oIds });
    ws.send(JSON.stringify(result));
    max = models.length;
  }
}

async function backupTable(ws, message) {
  console.log('backupTable', message);
  const params = JSON.parse(message);
  const { target, data } = params;
  let FN;
  if (target === 'backup') {
    FN = backupTables;
  }
  if (target === 'restore') {
    FN = restoreTables;
  }

  if (FN) {
    FN(ws, data);
  }
}
export default backupTable;
