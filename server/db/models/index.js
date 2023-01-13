const fs = require("fs");
const seq = require("../seq");

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

const options = {
  paranoid: true,
  createdAt: "createdTime",
  updatedAt: "updatedTime",
  deletedAt: "deletedTime",
};

let keys = fs.readdirSync(__dirname);
keys = keys.map((l) => l.replace(".js", "")).filter((l) => l !== "index");

const result = {};
const temp = {};

keys.forEach((key) => {
  const item = require(`./${key}`);
  temp[key] = item;
  result[key] = seq.define(key, item.model);
});

keys.forEach((key) => {
  const item = temp[key];
  const vals = ["hasMany", "hasOne", "belongsTo"];
  vals.forEach((val) => {
    const values = item[val] || {};
    const arrs = Object.keys(values);
    arrs.forEach((a) => {
      const options = {};
      const fkey = values[a];
      if (fkey) {
        options.foreignKey = fkey;
      }
      result[key][val](result[a], options);
    });
  });
});

module.exports = result;
