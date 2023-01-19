module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src/client'],
        ],
        extensions: [
          '.js',
          '.vue',
        ],
      },
    },
  },
  overrides: [
    {
      files: ['./server/app.js', './server/db/model/index.js'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'import/no-dynamic-require': 0,
        'global-require': 0,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    'vue',
  ],
  rules: {
    // 單行最大長度
    'max-len': ['error', { code: 800 }],
    // 关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    // for循環中可以用++
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // 去除console.log警告
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
  },
};
