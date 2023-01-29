import { BOOLEAN, INTEGER, STRING } from '../types.js';

const Noveler = {
  model: {
    domain: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '',
    },
    domainsearch: {
      type: STRING,
      comment: '',
    },
    titles: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    author: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    contents: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    lists: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    multlist: {
      type: STRING,
      comment: '',
    },
    listSort: {
      type: BOOLEAN,
      default: false,
      comment: '',
    },
    detailurl: {
      type: STRING,
      comment: '',
    },
    details: {
      type: STRING,
      allowNull: false,
      comment: '',
    },
    multpage: {
      type: STRING,
      comment: '',
    },
    detailex: {
      type: STRING,
      comment: '',
    },
    dstart: {
      type: INTEGER,
      comment: '',
    },
    dend: {
      type: INTEGER,
      comment: '',
    },
    encode: {
      type: STRING,
      comment: '',
    },
  },
};

export default Noveler;
