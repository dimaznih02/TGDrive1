# 🚀 Deploy ke Vercel - Step by Step

**Deploy SkyBox Telegram Drive ke Vercel GRATIS dalam 10 menit!**

## 📋 Prerequisites
- Akun GitHub
- Akun Vercel (gratis)
- Project SkyBox sudah ready

---

## 🔧 **STEP 1: Prepare Project**

### A. Clone/Download Project
```bash
# Method 1: Clone if you have git
git clone https://github.com/your-username/skybox-telegram-drive.git
cd skybox-telegram-drive

# Method 2: Download ZIP
# Download dari GitHub, extract, masuk ke folder
```

### B. Install Dependencies
```bash
npm install
```

### C. Setup Environment
```bash
# Copy template
cp .env.local.template .env.local

# Edit .env.local dengan data Telegram Anda
# (gunakan tutorial setup Telegram)
```

### D. Test Local (Optional tapi recommended)
```bash
npm run dev
# Buka http://localhost:3000
# Test upload file untuk pastikan working
```

---

## 🌐 **STEP 2: Deploy to Vercel**

### Method A: Via GitHub (Recommended)

#### 1. Push ke GitHub
```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial SkyBox Telegram Drive"

# Create repo di GitHub, then:
git remote add origin https://github.com/yourusername/skybox-drive.git
git branch -M main
git push -u origin main
```

#### 2. Connect to Vercel
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
6. Click "Deploy"

### Method B: Via Vercel CLI

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login & Deploy
```bash
# Login
vercel login

# Deploy
vercel

# Answer questions:
# ? Set up and deploy "~/skybox-telegram-drive"? Y
# ? Which scope do you want to deploy to? [your-username]
# ? Link to existing project? N
# ? What's your project's name? skybox-telegram-drive
# ? In which directory is your code located? ./

# Deploy to production
vercel --prod
```

---

## ⚙️ **STEP 3: Configure Environment Variables**

### Via Vercel Dashboard:

1. Go to your project dashboard
2. Click **Settings**
3. Click **Environment Variables**
4. Add each variable:

```bash
# Add these one by one:
TELEGRAM_BOT_TOKEN = 6123456789:AAEhBOweik6ad38aSkmvOuQALT-zkm4M6oM
STORAGE_CHANNEL_ID = -1001234567890
DATABASE_CHANNEL_ID = -1001234567891
USERS_CHANNEL_ID = -1001234567892
FOLDERS_CHANNEL_ID = -1001234567893
SHARES_CHANNEL_ID = -1001234567894
NEXTAUTH_SECRET = your-generated-secret
NEXTAUTH_URL = https://your-app.vercel.app
APP_URL = https://your-app.vercel.app
TELEGRAM_BOT_USERNAME = skybox_drive_bot
TELEGRAM_AUTH_TOKEN = your-generated-token
MAX_FILE_SIZE = 4000000000
ENABLE_PUBLIC_SHARING = true
ENABLE_SEARCH = true
ENABLE_FOLDER_UPLOAD = true
```

### Via CLI:
```bash
vercel env add TELEGRAM_BOT_TOKEN
# Paste your token

vercel env add STORAGE_CHANNEL_ID
# Paste your channel ID

# Repeat for all variables...
```

---

## 🔄 **STEP 4: Redeploy with Environment**

### Option A: Auto redeploy
- Vercel will auto-redeploy when you add environment variables

### Option B: Manual redeploy
```bash
vercel --prod
```

---

## ✅ **STEP 5: Test Production**

1. **Open your app**: `https://your-app.vercel.app`

2. **Test features**:
   - ✅ Login with Telegram
   - ✅ Upload a test file
   - ✅ Download the file
   - ✅ Create folder
   - ✅ Search functionality

3. **Check logs**: Go to Vercel dashboard > Functions tab for any errors

---

## 🎉 **SUCCESS! Your app is live!**

**Your SkyBox Telegram Drive is now running on:**
`https://your-app.vercel.app`

### 🔧 **Post-Deploy Tasks:**

#### Custom Domain (Optional):
1. Go to Vercel dashboard > Domains
2. Add your custom domain
3. Update NEXTAUTH_URL to your custom domain
4. Redeploy

#### Monitoring:
- Check Vercel dashboard for performance
- Monitor function executions
- Check error logs if any issues

---

## 🐛 **Common Issues & Solutions**

### **Build Errors:**
```bash
# Clear cache and redeploy
vercel --force
```

### **Environment Variable Issues:**
- Make sure all required vars are set
- Check for typos in variable names
- Ensure no extra spaces in values

### **Telegram API Errors:**
- Verify bot token is correct
- Check channel IDs are correct (include minus sign)
- Ensure bot is admin in all channels

### **Authentication Issues:**
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cache and cookies

---

## 💡 **Pro Tips:**

1. **Use Preview Deployments**: Every git push creates a preview
2. **Branch Deployments**: Create branches for testing
3. **Analytics**: Enable Vercel Analytics in dashboard
4. **Performance**: Monitor Core Web Vitals

**🔥 Congratulations! Your unlimited Google Drive clone is now live!**