/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    domains: [
      'api.telegram.org',
      'cdn.telegram.org',
      'lh3.googleusercontent.com'
    ],
  },
  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    STORAGE_CHANNEL_ID: process.env.STORAGE_CHANNEL_ID,
    DATABASE_CHANNEL_ID: process.env.DATABASE_CHANNEL_ID,
  },
  api: {
    bodyParser: {
      sizeLimit: '4gb',
    },
    responseLimit: false,
  },
}

module.exports = nextConfig