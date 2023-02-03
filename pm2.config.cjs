module.exports = {
  apps: [{
    name: 'icu',
    script: 'server/app.js',
    watch: false,
    max_memory_restart: '3G',
    node_args: '--max_old_space_size=3072',
    log_date_format: 'YYYY/MM/DD HH:mm:ss',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
