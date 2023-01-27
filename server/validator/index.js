import validate from './_validate.js';
import { deepCopy } from '../utils/tools.js';
import { types } from './type.js';

async function getSchema(model) {
  let result = {};
  let modeler;
  try {
    console.log('modeler');
    modeler = await import(`./model/${model}.js`);
  } catch (error) {
    console.log('modeler error', error.code);
    try {
      // 在数据库模型中
      modeler = await import(`../db/models/${model}.js`);
      if (modeler) {
        modeler = modeler.default.model;
      }
    } catch (ee) {
      console.log('modeler ee', ee.code);
      result.error = `没有找到 model: ${model} SCHEMA 配置`;
    }
  }

  // console.log('modeler', modeler);
  if (modeler) {
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
      properties[key] = deepCopy(types[type]);
    });

    // 校验规则
    result = {
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
  // console.log('modeler result', result);
  return result;
}

async function validator(model, data = {}) {
  const SCHEMA = await getSchema(model);
  if (SCHEMA.error) {
    return SCHEMA;
  }
  return validate(SCHEMA, data);
}

export default validator;
