/* eslint-disable max-classes-per-file */
class BaseModel {
  constructor({ code, data = null, message, ...result }) {
    this.code = code;
    if (data) {
      this.data = data;
    }

    if (message) {
      this.message = message;
    }

    Object.keys(result).forEach((key) => {
      const item = result[key];
      if (typeof item === 'number' || item) {
        this[key] = item;
      }
    });
  }
}

class SuccessModel extends BaseModel {
  constructor(result) {
    super({ code: 200, ...result });
  }
}

class ErrorModel extends BaseModel {
  constructor({ code, message }) {
    super({
      code,
      message,
    });
  }
}

export {
  SuccessModel,
  ErrorModel,
};
