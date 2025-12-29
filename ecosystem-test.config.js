// PM2 configuration file for spa-admin-test
module.exports = {
  apps: [{
    name: 'spa-admin-test',
    script: 'npm',
    args: 'start -- -p 8889',
    cwd: '/var/www/spa-admin-test',
    exec_mode: 'cluster',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8889
    }
  }]
};

