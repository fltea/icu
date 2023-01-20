module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src/client']],
        extensions: ['.js', '.vue'],
      },
    },
  },
  overrides: [
    {
      files: ['./vite.config.js', './server/**/*.js'],
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
  plugins: ['vue'],
  rules: {
    // 單行最大長度
    'max-len': ['error', { code: 800 }],
    // 关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    // for循環中可以用++
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // 去除console.log警告
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    // await 不能再循環中
    'no-await-in-loop': 0,
    // 不想能修改傳參
    'no-param-reassign': 0,
    'no-restricted-globals': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
    'object-curly-newline': 0,
    'import/prefer-default-export': 0,
  },
};
