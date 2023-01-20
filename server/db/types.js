// import Sequelize from 'sequelize';

export {
  STRING,
  FLOAT,
  DOUBLE,
  DECIMAL,
  INTEGER,
  TEXT,
  DATE,
  DATEONLY,
  TIME,
  BOOLEAN,
  Op,
} from 'sequelize';

// module.exports = {
//   STRING: Sequelize.STRING, // 255length
//   /**
//    *  如何选择float，double，decimal
//       结论总是放在最后，根据上面的分析：可以得出以下结论
//       1 如果你要表示的浮点型数据转成二进制之后能被32位float存储，或者可以容忍截断，则使用float，这个范围大概为要精确保存6位数字左右的浮点型数据
//       比如10分制的店铺积分可以用float存储，小商品零售价格(1000块之内)

//       2 如果你要表示的浮点型数据转成二进制之后能被64位double存储，或者可以容忍截断，这个范围大致要精确到保存13位数字左右的浮点型数据
//       比如汽车价格,几千万的工程造价

//       3 相比double，已经满足我们大部分浮点型数据的存储精度要求，如果还要精益求精，则使用decimal定点型存储
//       比如一些科学数据，精度要求很高的金钱
//       在货币或者财务方面的计算的时候建议使用decimal （System.Decimal）类型，或者在你需要使用很多位小数以及高精度的时候应该使用decimal 类型，以避免舍入方面的错误。
//     */
//   FLOAT: Sequelize.FLOAT, // 4精度浮点数
//   DOUBLE: Sequelize.DOUBLE, // 4精度浮点数
//   DECIMAL: Sequelize.DECIMAL, // IEEE 754 浮点数，如 JavaScript number 类型。
//   INTEGER: Sequelize.INTEGER, // 32bit
//   TEXT: Sequelize.TEXT,
//   DATE: Sequelize.DATE, // 'YYYY-MM-DD hh:mm:ss'
//   DATEONLY: Sequelize.DATEONLY, // 'YYYY-MM-DD'
//   TIME: Sequelize.TIME, // 'hh:mm:ss'
//   BOOLEAN: Sequelize.BOOLEAN,
// };
/**
    Post.findAll({
      where: {
        [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) AND (b = 6)
        [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) OR (b = 6)
        someAttribute: {
          // 基本
          [Op.eq]: 3,                              // = 3
          [Op.ne]: 20,                             // != 20
          [Op.is]: null,                           // IS NULL
          [Op.not]: true,                          // IS NOT TRUE
          [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

          // 使用方言特定的列标识符 (以下示例中使用 PG):
          [Op.col]: 'user.organization_id',        // = "user"."organization_id"

          // 数字比较
          [Op.gt]: 6,                              // > 6
          [Op.gte]: 6,                             // >= 6
          [Op.lt]: 10,                             // < 10
          [Op.lte]: 10,                            // <= 10
          [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
          [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

          // 其它操作符

          [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

          [Op.in]: [1, 2],                         // IN [1, 2]
          [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

          [Op.like]: '%hat',                       // LIKE '%hat'
          [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
          [Op.startsWith]: 'hat',                  // LIKE 'hat%'
          [Op.endsWith]: 'hat',                    // LIKE '%hat'
          [Op.substring]: 'hat',                   // LIKE '%hat%'
          [Op.iLike]: '%hat',                      // ILIKE '%hat' (不区分大小写) (仅 PG)
          [Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (仅 PG)
          [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (仅 MySQL/PG)
          [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (仅 MySQL/PG)
          [Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (仅 PG)
          [Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (仅 PG)

          [Op.any]: [2, 3],                        // ANY ARRAY[2, 3]::INTEGER (仅 PG)
          [Op.match]: Sequelize.fn('to_tsquery', 'fat & rat') // 匹配文本搜索字符串 'fat' 和 'rat' (仅 PG)

          // 在 Postgres 中, Op.like/Op.iLike/Op.notLike 可以结合 Op.any 使用:
          [Op.like]: { [Op.any]: ['cat', 'hat'] }  // LIKE ANY ARRAY['cat', 'hat']

          // 还有更多的仅限 postgres 的范围运算符,请参见下文
        }
      }
    });
   */
