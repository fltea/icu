# 随机字符串

### 指定字符集

``` js
/**
 *
 * @param {number} length 长度
 * @param {string} chars 字符集
 */
export function randStr(length = 8, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  let result = '';
  const clen = chars.length;
  if (typeof chars === 'string' && clen > length) {
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * clen)];
    }
  }
  return result;
}
```

### 随机数转36进制

``` js
Math.random().toString(36).slice(-8)
```

缺点：
只能生成有 0-9、a-z字符组成的字符串
由于 Math.random()生成的18位小数，可能无法填充36位，最后几个字符串，只能在指定的几个字符中选择。导致随机性降低。
某些情况下会返回空值。例如，当随机数为 0, 0.5, 0.25, 0.125...时，返回为空值。

### crypto

``` js
'use strict';
const crypto = require('crypto');

module.exports = len => {
        // isFinite 判断是否为有限数值
    if (!Number.isFinite(len)) {
        throw new TypeError('Expected a finite number');
    }

    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};
```

> crypto.randomBytes(size[, callback])

### node js hash算法

``` js
import crypto from 'crypto';

const hashstring = (string) => {
  const hash = crypto.createHash('sha256');
  hash.update(string, 'utf8');
  return hash.digest('hex');
};
export default hashstring;
```
