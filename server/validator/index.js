import validate from './_validate.js';
import { deepCopy } from '../utils/tools.js';
import { types } from './type.js';

function modedl2Schema(modeler, belongs) {
  const belongsTo = Object.values(belongs);
  const properties = {
    id: {
      type: 'number',
    },
  };
  const required = [];
  Object.keys(modeler).forEach((key) => {
    const item = modeler[key];
    if (item.allowNull === false) {
      required.push(key);
    }
    const type = item.type.key || item.type;
    const property = deepCopy(types[type]);
    if (belongsTo.includes(type)) {
      property.belongsTo = true;
    }
    properties[key] = property;
  });

  // 校验规则
  return {
    type: 'object',
    properties,
    if: {
      properties: { id: { anyOf: [{ const: 0 }, { const: null }] } },
    },
    then: {
      required,
    },
  };
}

async function getSchema(model) {
  let result = {};
  let modeler;
  try {
    // console.log('modeler');
    modeler = await import(`./model/${model}.js`);
    result = modedl2Schema(modeler.default);
  } catch (error) {
    // console.log('modeler error', error.code);
    try {
      // 在数据库模型中
      modeler = await import(`../db/models/${model}.js`);
      modeler = modeler.default;
      result = modedl2Schema(modeler.model, modeler.belongsTo || {});
    } catch (ee) {
      // console.log('modeler ee', ee.code);
      result.error = `没有找到 model: ${model} SCHEMA 配置`;
    }
  }

  return result;
}

async function validator(model, data = {}) {
  const SCHEMA = await getSchema(model);
  if (SCHEMA.error) {
    return null;
  }
  return validate(SCHEMA, data);
}

export default validator;
