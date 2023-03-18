/* eslint-disable no-underscore-dangle */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import seq from '../seq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * {
 *  model:{}
 *  hasMany: {
 *    key: value,
 *  }
 *  belongsTo: {
 *    key: value,
 *  }
 * }
 */

const soptions = {
  // paranoid: true,
  // createdAt: 'createdTime',
  // updatedAt: 'updatedTime',
  // deletedAt: 'deletedTime',
};

let keys = fs.readdirSync(__dirname);
keys = keys.map((l) => l.replace('.js', '')).filter((l) => l !== 'index');

const models = {};
const temp = {};

let i = 0;
const max = keys.length;
while (i < max) {
  const key = keys[i];
  let item = await import(`./${key}.js`);
  item = item.default;
  // console.log('item', item);
  temp[key] = item;
  models[key] = seq.define(key, item.model, soptions);
  i += 1;
}

// console.log('models', models);

keys.forEach((key) => {
  const item = temp[key];
  const vals = ['hasMany', 'hasOne', 'belongsTo'];
  vals.forEach((val) => {
    const values = item[val] || {};
    const arrs = Object.keys(values);
    arrs.forEach((a) => {
      const options = {};
      const fkey = values[a];
      if (fkey) {
        options.foreignKey = fkey;
      }
      models[key][val](models[a], options);
    });
  });
});

export default models;
