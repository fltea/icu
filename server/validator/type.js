module.exports = {
  STRING: {
    type: "string",
    maxLength: 255,
  }, // 255length
  FLOAT: {
    type: "number",
  }, //4精度浮点数
  DOUBLE: {
    type: "number",
  }, //4精度浮点数
  DECIMAL: {
    type: "number",
  }, //IEEE 754 浮点数，如 JavaScript number 类型。
  INTEGER: {
    type: "number",
  }, // 32bit
  TEXT: {
    type: "string",
  },
  DATE: {
    type: "string",
    format: "date-time",
    maxLength: 255,
  }, //'YYYY-MM-DD hh:mm:ss'
  DATEONLY: {
    type: "string",
    format: "date",
    maxLength: 255,
  }, //'YYYY-MM-DD'
  TIME: {
    type: "string",
    format: "time",
    maxLength: 255,
  }, //'hh:mm:ss'
  BOOLEAN: {
    type: "boolean",
  },
};
