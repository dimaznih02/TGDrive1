# 🚀 COMPLETE DEPLOYMENT GUIDE - SkyBox Drive

## 🎯 Quick Start (5 Minutes)

### Prerequisites Checklist
- [ ] Telegram bot created ✅
- [ ] 5 Telegram channels created ✅
- [ ] Bot added as admin to all channels ✅
- [ ] Environment variables ready ✅

### Super Fast Deploy
```bash
# 1. Clone repository
git clone <your-repo-url>
cd skybox-drive

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Deploy to Vercel (FREE)
npx vercel --prod
```

## 🌟 Platform Options

| Platform | Cost | Difficulty | Speed | Best For |
|----------|------|------------|-------|----------|
| **Vercel** | FREE | ⭐ Easy | ⚡ Fast | Recommended |
| **Netlify** | FREE | ⭐ Easy | ⚡ Fast | Alternative |
| **Railway** | FREE | ⭐⭐ Medium | ⚡ Fast | Auto-deploy |
| **Heroku** | $5-7/mo | ⭐⭐ Medium | 🐌 Slow | Traditional |
| **VPS** | $5-20/mo | ⭐⭐⭐ Hard | ⚡ Fast | Full control |

---

## 🔥 Option 1: Vercel (RECOMMENDED)

### Why Vercel?
- ✅ 100% FREE for personal use
- ✅ Global CDN (super fast)
- ✅ Automatic SSL
- ✅ Built for Next.js
- ✅ Zero configuration

### Deploy to Vercel

#### Method 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/skybox-drive)

#### Method 2: Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts:
# Set up and deploy? [Y/n] → Y
# Which scope? → Select your account
# Link to existing project? [y/N] → N
# What's your project's name? → skybox-drive
# In which directory is your code located? → ./
```

#### Method 3: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import from GitHub
5. Configure environment variables
6. Deploy!

### Configure Environment on Vercel
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add all variables from `.env.local`:

```env
TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
STORAGE_CHANNEL_ID = -1001234567890
DATABASE_CHANNEL_ID = -1001234567891
USERS_CHANNEL_ID = -1001234567892
FOLDERS_CHANNEL_ID = -1001234567893
SHARES_CHANNEL_ID = -1001234567894
TELEGRAM_APP_ID = 1234567
TELEGRAM_APP_HASH = abcdef1234567890abcdef1234567890
NEXTAUTH_SECRET = your_generated_secret
NEXTAUTH_URL = https://your-app.vercel.app
```

---

## 🌍 Option 2: Netlify

### Deploy to Netlify

#### Method 1: Drag & Drop
```bash
# Build for production
npm run build
npm run export

# Go to netlify.com, drag & drop 'out' folder
```

#### Method 2: Git Integration
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub
5. Select repository
6. Build command: `npm run build && npm run export`
7. Publish directory: `out`

### Configure Environment on Netlify
1. Site Settings → Environment Variables
2. Add all variables (same as Vercel)

---

## 🚂 Option 3: Railway

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables:set TELEGRAM_BOT_TOKEN=your_token
railway variables:set STORAGE_CHANNEL_ID=your_channel_id
# ... add all variables
```

### Alternative: One-Click Railway Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/skybox-drive)

---

## 🟣 Option 4: Heroku

### Deploy to Heroku
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create skybox-drive-yourname

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set STORAGE_CHANNEL_ID=your_channel_id
# ... set all variables

# Deploy
git push heroku main
```

---

## 🖥️ Option 5: VPS/Server (Advanced)

### Requirements
- Ubuntu 20.04+ / CentOS 8+
- Node.js 18+
- PM2 for process management
- Nginx (optional, for reverse proxy)

### Installation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd skybox-drive

# Install dependencies
npm install

# Build application
npm run build

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Start with PM2
pm2 start npm --name "skybox-drive" -- start
pm2 save
pm2 startup
```

### Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Environment Variables Explained

### Required Variables
```env
# Bot token from @BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Your bot username (without @)
TELEGRAM_BOT_USERNAME=skybox_drive_yourname_bot

# Channel IDs (all must be negative numbers)
STORAGE_CHANNEL_ID=-1001234567890
DATABASE_CHANNEL_ID=-1001234567891
USERS_CHANNEL_ID=-1001234567892
FOLDERS_CHANNEL_ID=-1001234567893
SHARES_CHANNEL_ID=-1001234567894

# Telegram API credentials from my.telegram.org/apps
TELEGRAM_APP_ID=1234567
TELEGRAM_APP_HASH=abcdef1234567890abcdef1234567890

# NextAuth configuration
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=https://your-deployed-app.com
```

### Optional Variables
```env
# Application settings
NODE_ENV=production
APP_NAME=SkyBox Drive
MAX_FILE_SIZE=4000000000
ENABLE_COMPRESSION=true

# Security
RATE_LIMIT_ENABLED=true
MAX_UPLOADS_PER_HOUR=10
```

---

## ✅ Post-Deployment Checklist

### Test Your Deployment
1. **Visit your app URL**
   - Should show SkyBox Drive login page

2. **Test Telegram login**
   - Click "Login with Telegram"
   - Should redirect to Telegram
   - Should redirect back after auth

3. **Test file upload**
   - Upload a small test file
   - Should show success message
   - File should appear in files list

4. **Test file download**
   - Click download on uploaded file
   - Should download successfully

### Update Environment for Production
```env
# Update these for production:
NEXTAUTH_URL=https://your-actual-domain.com
NODE_ENV=production
```

### Configure Custom Domain (Optional)
- **Vercel**: Project Settings → Domains
- **Netlify**: Domain Settings → Custom domains
- **Railway**: Settings → Domains
- **Heroku**: Settings → Domains

---

## 🆘 Troubleshooting

### Common Issues

#### "Bot token is invalid"
- Check token has no extra spaces
- Regenerate token with @BotFather: `/token`

#### "Channel not found"
- Ensure channel IDs are negative numbers
- Bot must be admin in all channels
- Channels must be private

#### "Authentication failed"
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

#### "File upload fails"
- Check file size < 4GB
- Verify storage channel permissions
- Check network connection

### Performance Issues

#### Slow uploads
- Files are chunked automatically
- Large files take time (expected)
- Check network speed

#### Login timeout
- Clear browser cache
- Check Telegram API credentials
- Verify bot is not rate limited

---

## 📊 Cost Comparison

### FREE Options
- **Vercel**: 100GB bandwidth, 1000 builds/month
- **Netlify**: 100GB bandwidth, 300 build minutes
- **Railway**: $5 credit monthly (covers small apps)

### Paid Options
- **Heroku**: $7/month (hobby dyno)
- **VPS**: $5-20/month (DigitalOcean, Linode)

### Storage Costs
- **SkyBox (Telegram)**: $0/month ✅
- **Google Drive**: $6-10/month
- **Dropbox**: $10-15/month
- **AWS S3**: $2-5/month (limited)

**💰 Annual Savings: $72-216+ per year!**

---

## 🎉 You're Live!

Congratulations! Your SkyBox Drive is now live with:
- ✅ FREE unlimited storage
- ✅ 4GB file upload limit
- ✅ Global CDN delivery
- ✅ Secure Telegram authentication
- ✅ Mobile-responsive design
- ✅ Real-time file sync

**Share your success!** Tweet about your new FREE Google Drive alternative! 🎊

---

## 🔄 Updates & Maintenance

### Auto-updates (Recommended)
- **Vercel/Netlify**: Auto-deploy on git push
- **Railway**: Auto-deploy enabled by default

### Manual updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Deploy updates
npm run build
# Then deploy to your platform
```

### Monitoring
- Check deployment logs in platform dashboard
- Monitor bot messages in Telegram
- Set up uptime monitoring (optional)

---

## 🆘 Need Help?

- 📖 Check troubleshooting section above
- 🐛 Create issue on GitHub
- 💬 Join our community (link in README)
- 📧 Contact support

**Happy cloud storage! 🌥️✨**