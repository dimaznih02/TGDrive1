# 🌐 Deploy ke Netlify - Step by Step

**Deploy SkyBox Telegram Drive ke Netlify GRATIS!**

## 🔧 **STEP 1: Prepare for Netlify**

### A. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### B. Build Project
```bash
# Make sure dependencies installed
npm install

# Build for production
npm run build
```

---

## 🚀 **STEP 2: Deploy via GitHub**

### Method A: GitHub Integration (Recommended)

#### 1. Push to GitHub (same as Vercel guide)
```bash
git init
git add .
git commit -m "SkyBox Telegram Drive"
git remote add origin https://github.com/yourusername/skybox-drive.git
git push -u origin main
```

#### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Login with GitHub
3. Click "New site from Git"
4. Choose GitHub
5. Select your repository
6. Configure:
   - **Branch**: main
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
7. Click "Deploy site"

---

## ⚙️ **STEP 3: Configure Environment Variables**

### Via Netlify Dashboard:
1. Go to Site settings
2. Click "Environment variables"
3. Add variables:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
STORAGE_CHANNEL_ID=-1001234567890
DATABASE_CHANNEL_ID=-1001234567891
USERS_CHANNEL_ID=-1001234567892
FOLDERS_CHANNEL_ID=-1001234567893
SHARES_CHANNEL_ID=-1001234567894
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-site-name.netlify.app
```

### Via CLI:
```bash
netlify login
netlify env:set TELEGRAM_BOT_TOKEN your_token
netlify env:set STORAGE_CHANNEL_ID -1001234567890
# Continue for all variables...
```

---

## 🔄 **STEP 4: Redeploy**
```bash
# Trigger new deployment
netlify deploy --prod --dir=.next
```

---

## ✅ **Success!**
Your app is live at: `https://your-site-name.netlify.app`