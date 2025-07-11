/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // API routes configuration moved to pages/api/_middleware.js or individual API routes
  // bodyParser configuration should be done per API route, not globally
}

module.exports = nextConfig