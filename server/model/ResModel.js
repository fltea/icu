class BaseModel {
  constructor({ code, data, message }) {
    this.code = code;
    if (data) {
      this.data = data;
    }

    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data = null) {
    super({
      code: 200,
      data,
    });
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

module.exports = {
  SuccessModel,
  ErrorModel,
};
