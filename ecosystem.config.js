module.exports = {
  apps: [{
    name: 'frontend-store-production',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:'apk_01K9S8YVNZ4DPVHJMQ0PF18X2C'
      PORT: 8000
    }
  }]
};
