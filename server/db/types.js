const Sequelize = require('sequelize')

module.exports = {
  STRING: Sequelize.STRING, // 255length
  /**
   *  如何选择float，double，decimal
      结论总是放在最后，根据上面的分析：可以得出以下结论 
      1 如果你要表示的浮点型数据转成二进制之后能被32位float存储，或者可以容忍截断，则使用float，这个范围大概为要精确保存6位数字左右的浮点型数据 
      比如10分制的店铺积分可以用float存储，小商品零售价格(1000块之内)

      2 如果你要表示的浮点型数据转成二进制之后能被64位double存储，或者可以容忍截断，这个范围大致要精确到保存13位数字左右的浮点型数据 
      比如汽车价格,几千万的工程造价

      3 相比double，已经满足我们大部分浮点型数据的存储精度要求，如果还要精益求精，则使用decimal定点型存储 
      比如一些科学数据，精度要求很高的金钱
      在货币或者财务方面的计算的时候建议使用decimal （System.Decimal）类型，或者在你需要使用很多位小数以及高精度的时候应该使用decimal 类型，以避免舍入方面的错误。
    */
  FLOAT: Sequelize.FLOAT,  //4精度浮点数
  DOUBLE: Sequelize.DOUBLE,  //4精度浮点数
  DECIMAL: Sequelize.DECIMAL, //IEEE 754 浮点数，如 JavaScript number 类型。 
  INTEGER: Sequelize.INTEGER, // 32bit
  TEXT: Sequelize.TEXT,
  DATE: Sequelize.DATE, //'YYYY-MM-DD hh:mm:ss'
  DATEONLY: Sequelize.DATEONLY, //'YYYY-MM-DD'
  TIME: Sequelize.TIME,  //'hh:mm:ss' 
  BOOLEAN: Sequelize.BOOLEAN
}