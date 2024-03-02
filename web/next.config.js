/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public'
})
const nextConfig = withPWA({
    experimental: {
        appDir: true,
      },
})

module.exports = nextConfig
