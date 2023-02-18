import Ajv from 'ajv';

const ajv = new Ajv();

// YYYY-MM-DD hh:mm:ss
ajv.addFormat('date-time', /(^$)|(^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$)/);
// YYYY-MM-DD
ajv.addFormat('date', /(^$)|(^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$)/);
// hh:mm:ss
ajv.addFormat('time', /(^$)|(^[0-9]{2}:[0-9]{2}:[0-9]{2})$/);

function validate(schema, data = {}) {
  // 处理数据
  const rules = schema.properties;
  const list = Object.keys(rules);

  list.forEach((key) => {
    const item = rules[key];
    const temp = data[key] || '';
    if (item.type === 'number') {
      data[key] = +temp;
    }
    if (item.type === 'boolean') {
      data[key] = temp === 'false' ? false : !!temp;
    }
  });

  const valid = ajv.validate(schema, data);
  if (!valid) {
    return {
      error: ajv.errors[0],
    };
  }
  // 数据处理
  list.forEach((key) => {
    const item = rules[key];
    const temp = data[key];
    const keys = ['date-time', 'date', 'time'];
    if (!temp && (item.belongsTo || keys.includes(item.format))) {
      data[key] = null;
    }
  });
  return null;
}

export default validate;
