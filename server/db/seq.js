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

// 事务回滚
export async function rollBack(promise, data) {
  // 首先,我们开始一个事务并将其保存到变量中
  const t = await seq.transaction();
  try {
    const result = await promise(data);
    await t.commit();
    return result;
  } catch (error) {
    console.log('error', error);
    await t.rollback();
    throw error;
  }
}
