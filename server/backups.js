import { restoreTable } from './controllers/backupTable.js';
import { BACKUP_DIR } from './conf/constant.js';
import models from './db/models/index.js';
import { reqiureFile, hashBrFile } from './utils/files.js';
// const tables = ['Clutter', 'Chapter'];

const oIds = {};
const date = '2023-03-18';
// Clutter
await restoreTable({ date, table: 'Clutter', oIds });

function getAttributes(item) {
  const attris = item.getAttributes();
  const keys = Object.keys(attris);
  const allkeys = [];
  const isAt = /At$/;
  keys.forEach((key) => {
    if (!isAt.test(key)) {
      allkeys.push(key);
    }
  });
  return allkeys;
}

// Chapter
const lpath = `${BACKUP_DIR}/${date}`;
let result = reqiureFile(`${lpath}/Chapter.json`);
let text = hashBrFile(lpath, 'Chapter');
result = JSON.parse(result);
text = JSON.parse(text);

// 小说
let list = result.list.filter((v) => !v.typeId);
let item = models.Media;
let allkeys = getAttributes(item);
const ids = {};
oIds.Media = ids;
list = list.map((v) => {
  Object.keys(v).forEach((key) => {
    if (!allkeys.includes(key)) {
      delete v[key];
    }
  });
  const data = text[v.id] || {};
  v.abstract = data.content || null;
  return v;
});
// console.log(allkeys, list.length);

let max = list.length;
while (max) {
  const oitem = list.shift();
  const OID = oitem.id;
  delete oitem.id;
  console.log(oitem.title);
  const [createItem] = await item.findOrCreate({
    where: oitem,
    raw: true,
  });
  ids[OID] = createItem.id;
  max = list.length;
}

// 章节
list = result.list.filter((v) => !!v.typeId);
item = models.Chapter;
allkeys = getAttributes(item);
console.log(oIds, allkeys, list.length);
list = list.map((v) => {
  // media
  v.media = oIds.Media[v.typeId];
  Object.keys(v).forEach((key) => {
    if (!allkeys.includes(key)) {
      delete v[key];
    }
  });
  v.title = v.title.replace(/\s+?/g, '');
  const data = text[v.id] || {};
  v.content = data.content || null;
  return v;
});
// console.log(oIds, allkeys, list.length);

max = list.length;
while (max) {
  console.log(max);
  const oitem = list.shift();
  const hasValue = await item.findOne({
    where: {
      url: oitem.url,
    },
    raw: true,
  });
  if (!hasValue && oitem.media) {
    delete oitem.id;
    // console.log(oitem.media, oitem.title);
    await item.findOrCreate({
      where: oitem,
      raw: true,
    });
  }
  max = list.length;
}
