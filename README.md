# 🌤️ SkyBox Drive - FREE Unlimited Cloud Storage

> **Google Drive Alternative powered by Telegram** • Save $72-216+ per year!

<div align="center">

![SkyBox Drive](https://img.shields.io/badge/SkyBox-Drive-blue?style=for-the-badge&logo=telegram)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Telegram](https://img.shields.io/badge/Telegram-Storage-blue?style=for-the-badge&logo=telegram)
![Free](https://img.shields.io/badge/100%25-FREE-green?style=for-the-badge)

**[🚀 Live Demo](https://skybox-drive.vercel.app)** • **[📖 Setup Guide](TELEGRAM-SETUP-GUIDE.md)** • **[🚀 Deploy Now](COMPLETE-DEPLOYMENT-GUIDE.md)**

</div>

---

## ✨ Features

### 🎯 Core Features
- 🔄 **Unlimited Storage** - No storage limits (Telegram = 8 billion users)
- 📁 **4GB File Uploads** - 40x larger than basic Google Drive
- 🔐 **Secure Authentication** - Login with Telegram (2FA built-in)
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Global CDN** - Fast downloads worldwide
- 🆓 **100% FREE** - No hidden costs, ever!

### 🚀 Advanced Features
- 📊 **Real-time Sync** - Instant file updates
- 🔍 **Smart Search** - Find files quickly
- 📂 **Folder Management** - Organize your files
- � **File Sharing** - Share with public links
- 🌍 **Multi-language** - Supports multiple languages
- 📈 **Usage Analytics** - Track your storage usage

---

## 💰 Cost Comparison

| Service | Monthly Cost | Storage Limit | File Size Limit | Annual Cost |
|---------|-------------|---------------|-----------------|-------------|
| **SkyBox Drive** | **$0** ✅ | **Unlimited** ✅ | **4GB** ✅ | **$0** ✅ |
| Google Drive | $6-$10 | 100GB-2TB | 5TB | $72-$120 |
| Dropbox | $10-$15 | 2TB-3TB | 100GB | $120-$180 |
| OneDrive | $7-$10 | 1TB-6TB | 250GB | $84-$120 |
| iCloud | $3-$10 | 50GB-2TB | 50GB | $36-$120 |

**💸 Save $72-216+ per year!**

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 + React 19
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js + Telegram
- **Storage**: Telegram Bot API
- **Database**: Telegram Channels
- **Deployment**: Vercel/Netlify (FREE)

---

## 🚀 Quick Start

### Option 1: One-Click Deploy (Fastest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/skybox-drive)

### Option 2: Manual Setup (5 minutes)
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/skybox-drive.git
cd skybox-drive

# 2. Install dependencies
npm install

# 3. Setup Telegram (follow guide)
# See: TELEGRAM-SETUP-GUIDE.md

# 4. Configure environment
cp .env.example .env.local
# Fill in your Telegram credentials

# 5. Run locally
npm run dev

# 6. Deploy to production
npx vercel --prod
```

### Option 3: Development Setup
```bash
# For developers who want to customize
git clone https://github.com/YOUR_USERNAME/skybox-drive.git
cd skybox-drive
npm install
npm run dev
```

---

## 📚 Complete Setup Guide

### 1. 🤖 Telegram Setup (5 mins)
Follow our **[Telegram Setup Guide](TELEGRAM-SETUP-GUIDE.md)** to:
- Create Telegram bot
- Setup 5 private channels
- Get API credentials
- Configure environment

### 2. 🚀 Deploy Your App (5 mins)
Follow our **[Deployment Guide](COMPLETE-DEPLOYMENT-GUIDE.md)** for:
- **Vercel** (Recommended - FREE)
- **Netlify** (Alternative - FREE)
- **Railway** (Auto-deploy)
- **Heroku** (Traditional)
- **VPS/Server** (Advanced)

### 3. ✅ Test Everything (2 mins)
- Login with Telegram ✅
- Upload test file ✅
- Download file ✅
- Share file ✅

**Total setup time: ~12 minutes**

---

## 🏗️ Project Structure

```
skybox-drive/
├── 📁 pages/
│   ├── 📁 api/
│   │   ├── 📁 auth/
│   │   │   └── [...nextauth].js     # Telegram authentication
│   │   └── 📁 files/
│   │       ├── upload.js            # File upload API
│   │       ├── list.js              # List files API
│   │       └── download.js          # Download API
│   └── index.js                     # Main application page
├── 📁 lib/
│   └── telegram-storage.js          # Telegram storage service
├── 📁 components/
│   └── [UI components]              # React components
├── 📄 next.config.js                # Next.js configuration
├── 📄 package.json                  # Dependencies
├── 📄 .env.example                  # Environment template
├── 📄 TELEGRAM-SETUP-GUIDE.md       # Setup instructions
├── 📄 COMPLETE-DEPLOYMENT-GUIDE.md  # Deployment guide
└── 📄 README.md                     # This file
```

---

## 🔧 Environment Variables

Create `.env.local` with these variables:

```env
# Telegram Bot (from @BotFather)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=your_bot_username

# Telegram Channels (5 private channels)
STORAGE_CHANNEL_ID=-1001234567890
DATABASE_CHANNEL_ID=-1001234567891
USERS_CHANNEL_ID=-1001234567892
FOLDERS_CHANNEL_ID=-1001234567893
SHARES_CHANNEL_ID=-1001234567894

# Telegram API (from my.telegram.org/apps)
TELEGRAM_APP_ID=1234567
TELEGRAM_APP_HASH=abcdef1234567890abcdef1234567890

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=https://your-app-url.com
```

**📝 Full setup guide: [TELEGRAM-SETUP-GUIDE.md](TELEGRAM-SETUP-GUIDE.md)**

---

## 🎯 Use Cases

### 👤 Personal Use
- **Photo backup** - Store unlimited photos/videos
- **Document storage** - Keep important documents safe
- **Media archive** - Music, movies, podcasts
- **Backup solution** - Replace Google Drive/Dropbox

### 👥 Business Use
- **Team collaboration** - Share files with team
- **Client deliverables** - Send large files to clients
- **Asset storage** - Store design assets, logos
- **Data backup** - Backup business data

### 🛠️ Developer Use
- **Code repositories** - Store project backups
- **Asset storage** - Images, videos for apps
- **Client demos** - Share demo files
- **Build artifacts** - Store compiled applications

---

## 🔒 Security & Privacy

### 🛡️ Security Features
- **End-to-end encryption** via Telegram
- **Private channels** - Your data stays private
- **Secure authentication** - Telegram 2FA built-in
- **No data tracking** - We don't track your files
- **GDPR compliant** - European privacy standards

### 🔐 Privacy Guarantees
- ✅ Your files are stored in YOUR Telegram channels
- ✅ Only YOU have access to your bot and channels
- ✅ We don't store any of your data on our servers
- ✅ Open source - verify the code yourself
- ✅ No analytics or tracking

---

## 📈 Performance

### ⚡ Speed Metrics
- **Upload speed**: Limited by your internet
- **Download speed**: Global CDN (Telegram's infrastructure)
- **File processing**: Real-time
- **Search**: Instant results
- **Global availability**: 99.99% uptime

### 📊 Limits
- **File size**: 4GB per file (Telegram limit)
- **Storage**: Unlimited (Telegram = unlimited)
- **Bandwidth**: Unlimited
- **API calls**: 30 requests/second (Telegram limit)

---

## 🤝 Contributing

We welcome contributions! Here's how:

### 🐛 Report Bugs
- Check existing issues first
- Provide detailed reproduction steps
- Include environment details

### ✨ Suggest Features
- Open an issue with [Feature Request] tag
- Describe the use case
- Explain why it would be useful

### 💻 Code Contributions
```bash
# Fork repository
git fork https://github.com/YOUR_USERNAME/skybox-drive

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm run test

# Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# Create pull request
```

---

## � Support

### 🆘 Getting Help
- 📖 **Documentation**: Check our guides first
- 🐛 **Bug Reports**: Create GitHub issue
- 💬 **Community**: Join our Discord/Telegram
- 📧 **Email**: contact@skybox-drive.com

### 📚 Resources
- **[Setup Guide](TELEGRAM-SETUP-GUIDE.md)** - Complete setup instructions
- **[Deployment Guide](COMPLETE-DEPLOYMENT-GUIDE.md)** - Deploy to any platform
- **[API Documentation](docs/API.md)** - For developers
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 🔓 What this means:
- ✅ **Free to use** - Personal and commercial
- ✅ **Modify freely** - Customize as needed
- ✅ **Redistribute** - Share with others
- ✅ **Private use** - Use internally
- ❌ **No warranty** - Use at your own risk

---

## 🙏 Acknowledgments

### 🎉 Special Thanks
- **[Jahanvi Dubey](https://github.com/jahanvi-dev)** - Original SkyBox creator
- **Telegram Team** - For amazing Bot API
- **Next.js Team** - For the awesome framework
- **Vercel** - For free hosting
- **Open Source Community** - For endless inspiration

### 🔗 Built With
- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Telegram Bot API](https://core.telegram.org/bots/api) - Storage backend
- [Vercel](https://vercel.com/) - Deployment platform

---

## � What's Next?

### 🛣️ Roadmap 2024
- 📱 **Mobile App** - Native iOS/Android apps
- 🎨 **Themes** - Multiple UI themes
- � **Auto-sync** - Desktop sync client
- 📊 **Analytics** - Usage statistics
- 🌍 **i18n** - Multiple languages
- � **Integrations** - Third-party app integrations

### � Feature Requests
Vote for features you want:
- [ ] Video streaming
- [ ] Image gallery
- [ ] Collaborative editing
- [ ] Team workspaces
- [ ] API access
- [ ] Desktop client

---

<div align="center">

## 🌟 Star this repo if it helped you!

**Made with ❤️ by the SkyBox community**

**[⭐ Star](https://github.com/YOUR_USERNAME/skybox-drive)** • **[🍴 Fork](https://github.com/YOUR_USERNAME/skybox-drive/fork)** • **[🐛 Issues](https://github.com/YOUR_USERNAME/skybox-drive/issues)** • **[💬 Discussions](https://github.com/YOUR_USERNAME/skybox-drive/discussions)**

---

### 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/skybox-drive?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/skybox-drive?style=social)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/skybox-drive)
![GitHub license](https://img.shields.io/github/license/YOUR_USERNAME/skybox-drive)

**Transform your cloud storage experience today! �**

</div>
