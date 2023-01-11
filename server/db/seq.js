const Sequelize = require("sequelize");
const { MYSQL_CONF } = require("../conf/db.js");

const { host, user, password, database } = MYSQL_CONF;
const conf = {
  host,
  dialect: "mysql",
  timezone: "+08:00",
};
const seq = new Sequelize(database, user, password, conf);

module.exports = seq;
