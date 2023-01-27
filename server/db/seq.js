import Sequelize from 'sequelize';
import { MYSQL_CONF } from '../conf/db.js';
import { setLog } from '../utils/files.js';

const { host, user, password, database } = MYSQL_CONF;
const conf = {
  host,
  dialect: 'mysql',
  timezone: '+08:00',
  logging: (sql) => {
    setLog('mysql-sql', sql);
  },
};
const seq = new Sequelize(database, user, password, conf);

export default seq;
