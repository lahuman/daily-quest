// next.config.js
/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  customWorkerDir: 'worker',
  runtimeCaching,
});

const nextConfig = withPWA({
    experimental: {
        appDir: true,
      },
})

module.exports = nextConfig
