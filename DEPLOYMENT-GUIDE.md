# 🚀 SkyBox Telegram Deployment Guide

**Complete deployment guide for SkyBox - FREE Unlimited Google Drive Clone powered by Telegram**

## 📋 Pre-Deployment Checklist

- ✅ Telegram bot created and configured
- ✅ 5 Telegram channels setup
- ✅ Bot added to all channels as admin
- ✅ Channel IDs collected
- ✅ Environment variables ready
- ✅ Test configuration passed

---

## 📦 Environment Setup

### 1. Create `.env.local` file:
```bash
# Copy from .env.example
cp .env.example .env.local
```

### 2. Fill in your values:
```bash
# Required - Get from your Telegram setup
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
STORAGE_CHANNEL_ID=-1001234567890
DATABASE_CHANNEL_ID=-1001234567891
USERS_CHANNEL_ID=-1001234567892
FOLDERS_CHANNEL_ID=-1001234567893
SHARES_CHANNEL_ID=-1001234567894

# Required - Generate random strings
NEXTAUTH_SECRET=your-random-secret-here
TELEGRAM_AUTH_TOKEN=another-random-secret

# Required - Your domain (localhost for dev)
NEXTAUTH_URL=https://yourdomain.com
APP_URL=https://yourdomain.com
```

### 3. Generate secrets:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate TELEGRAM_AUTH_TOKEN  
openssl rand -base64 32
```

---

## 🏗️ Build & Test Locally

### 1. Install dependencies:
```bash
npm install
```

### 2. Test configuration:
```bash
npm run test-config
```

### 3. Run development server:
```bash
npm run dev
```

### 4. Test in browser:
```
http://localhost:3000
```

**Expected behavior:**
- ✅ Website loads without errors
- ✅ Telegram authentication works
- ✅ File upload works
- ✅ File download works
- ✅ Folder creation works

---

## 🌐 DEPLOYMENT OPTIONS

## Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ **FREE** tier with generous limits
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Environment variables UI**
- ✅ **Zero-config deployment**

### Steps:

#### A. Install Vercel CLI:
```bash
npm install -g vercel
```

#### B. Login to Vercel:
```bash
vercel login
```

#### C. Deploy:
```bash
vercel --prod
```

#### D. Set Environment Variables:
```bash
# In Vercel dashboard:
# 1. Go to your project
# 2. Settings → Environment Variables
# 3. Add all variables from .env.local
# 4. Redeploy
```

#### E. Update Telegram webhooks (optional):
```bash
# Update TELEGRAM_WEBHOOK_URL in environment
TELEGRAM_WEBHOOK_URL=https://your-domain.vercel.app/api/webhook/telegram
```

---

## Option 2: Netlify

### Steps:

#### A. Build for production:
```bash
npm run build
```

#### B. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

#### C. Login and deploy:
```bash
netlify login
netlify deploy --prod --dir=.next
```

#### D. Set environment variables in Netlify dashboard

---

## Option 3: Railway

### Steps:

#### A. Install Railway CLI:
```bash
npm install -g @railway/cli
```

#### B. Login and deploy:
```bash
railway login
railway init
railway up
```

#### C. Set environment variables:
```bash
railway variables:set TELEGRAM_BOT_TOKEN=your-token
# Set all other variables...
```

---

## Option 4: Heroku

### Steps:

#### A. Install Heroku CLI and login:
```bash
heroku login
```

#### B. Create app:
```bash
heroku create your-skybox-app
```

#### C. Set environment variables:
```bash
heroku config:set TELEGRAM_BOT_TOKEN=your-token
heroku config:set STORAGE_CHANNEL_ID=-1001234567890
# Set all other variables...
```

#### D. Deploy:
```bash
git push heroku main
```

---

## Option 5: VPS/Server (Advanced)

### Requirements:
- Ubuntu 20.04+ or similar
- Node.js 18+
- PM2 for process management

### Steps:

#### A. Setup server:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### B. Clone and setup:
```bash
# Clone your repository
git clone https://github.com/your-username/skybox-telegram-drive.git
cd skybox-telegram-drive

# Install dependencies
npm install

# Create production environment
cp .env.example .env.production
# Edit .env.production with your values

# Build
npm run build
```

#### C. Start with PM2:
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'skybox-drive',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production'
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### D. Setup Nginx (optional):
```nginx
# /etc/nginx/sites-available/skybox
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### E. Enable and start Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/skybox /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### F. Setup SSL with Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Telegram Bot Webhooks:
```bash
# Set webhook URL (optional for real-time updates)
curl -X POST "https://api.telegram.org/bot{YOUR_BOT_TOKEN}/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://yourdomain.com/api/webhook/telegram"}'
```

### 2. Test Production:
- ✅ Visit your deployed URL
- ✅ Test Telegram authentication
- ✅ Upload a test file
- ✅ Download the file
- ✅ Create and delete folders
- ✅ Test sharing functionality

### 3. DNS Configuration (if using custom domain):
```
# Add these DNS records:
Type: A
Name: @
Value: [Your server IP]

Type: CNAME  
Name: www
Value: yourdomain.com
```

---

## 📊 Performance Optimization

### 1. Enable Caching (Optional):
```bash
# Add Redis for metadata caching
# Add to .env.production:
REDIS_URL=redis://localhost:6379
```

### 2. CDN Setup:
- Cloudflare (FREE tier available)
- Enable caching for static assets
- Enable compression

### 3. Monitoring:
```bash
# Add monitoring tools
npm install @sentry/nextjs
# Configure in next.config.js
```

---

## 🛡️ Security Considerations

### 1. Environment Variables:
- ✅ Never commit `.env` files
- ✅ Use different secrets for production
- ✅ Rotate tokens regularly

### 2. Bot Security:
- ✅ Enable 2FA on Telegram account
- ✅ Keep bot token secure
- ✅ Monitor bot logs

### 3. Application Security:
- ✅ Enable HTTPS only
- ✅ Set proper CORS headers
- ✅ Implement rate limiting

---

## 📈 Scaling Considerations

### When you need to scale:
- **Files**: Telegram can handle millions of files
- **Users**: Add Redis caching
- **Performance**: Use multiple bot tokens
- **Regions**: Deploy to multiple regions

### Advanced scaling:
```bash
# Multiple bot tokens for load balancing
TELEGRAM_BOT_TOKENS=token1,token2,token3

# Database clustering
TELEGRAM_CHANNELS_CLUSTER=channel1,channel2,channel3
```

---

## 🔍 Troubleshooting

### Common Issues:

#### Build Errors:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Issues:
```bash
# Check environment variables
npm run check-env
```

#### Telegram API Errors:
```bash
# Test bot connectivity
curl "https://api.telegram.org/bot{YOUR_TOKEN}/getMe"
```

#### File Upload Issues:
- Check file size limits (4GB max)
- Verify bot permissions in storage channel
- Check network connectivity

---

## 📞 Support

If you encounter issues:

1. Check the logs in your deployment platform
2. Verify all environment variables are set
3. Test Telegram bot connectivity
4. Check channel permissions

---

## 🎉 Success!

**Your SkyBox Telegram Drive is now live!**

**Features working:**
- ✅ **FREE unlimited storage** (vs $15-50+/month competitors)
- ✅ **4GB file uploads** (vs 100MB limits)
- ✅ **Global CDN delivery** (fast downloads worldwide)
- ✅ **Real-time sync** (via Telegram)
- ✅ **99.99% uptime** (Telegram infrastructure)
- ✅ **Mobile notifications** (via Telegram)
- ✅ **No vendor lock-in** (you own your data)

**You just built the most cost-effective Google Drive alternative! 🔥**