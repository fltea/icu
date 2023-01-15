const validate = require("./_validate");
const { deepCopy } = require("../utils");
const types = require("./type");

function getSchema(model) {
  let result = {};
  let modeler;
  try {
    modeler = require(`./model/${model}`);
  } catch (error) {
    try {
      // 在数据库模型中
      modeler = require(`../db/model/${model}`);
      if (modeler) {
        modeler = modeler.model;
      }
    } catch (error) {
      result.error = `没有找到 model: ${model} SCHEMA 配置`;
    }
  }

  if (modeler) {
    const properties = {
      id: {
        type: "number",
      },
    };
    const required = [];
    Object.keys(modeler).forEach((key) => {
      const item = modeler[key];
      if (item.allowNull === false) {
        required.push(key);
      }
      let type = item.type.key || item.type;
      properties[key] = deepCopy(types[type]);
    });

    // 校验规则
    result = {
      type: "object",
      properties,
      if: {
        properties: { id: { anyOf: [{ const: 0 }, { const: null }] } },
      },
      then: {
        required,
      },
    };
  }
  return result;
}

function validator(model, data = {}) {
  const SCHEMA = getSchema(model);
  if (SCHEMA.error) {
    return SCHEMA;
  }
  return validate(SCHEMA, data);
}

module.exports = validator;
