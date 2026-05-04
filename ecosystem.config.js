// PM2 configuration file for web-29d-admin
module.exports = {
  apps: [{
    name: 'spa-admin',
    script: 'npm',
    args: 'start -- -p 8899',
    cwd: '/var/www/spa-admin',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8899
    }
  }]
};
