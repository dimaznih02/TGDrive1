# 🚀 TELEGRAM SETUP GUIDE - SkyBox Drive

## 📋 Prerequisites
- Telegram account
- Basic command line knowledge
- 15 minutes of your time

## 🤖 Step 1: Create Telegram Bot

### 1.1 Talk to BotFather
1. Open Telegram app
2. Search for `@BotFather`
3. Send `/start`
4. Send `/newbot`
5. Enter bot name: `SkyBox Drive Bot`
6. Enter username: `skybox_drive_YOUR_USERNAME_bot`
7. **Save the bot token** (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 1.2 Configure Bot Settings
```
/setdescription - Set bot description
Description: Unlimited cloud storage powered by Telegram

/setabouttext - Set about text  
About: SkyBox Drive - FREE unlimited cloud storage

/setuserpic - Upload a profile picture (optional)
```

## 📢 Step 2: Create Telegram Channels

### 2.1 Create 5 Private Channels
Create these channels in Telegram:
1. **SkyBox Storage** - For file storage
2. **SkyBox Database** - For metadata
3. **SkyBox Users** - For user data
4. **SkyBox Folders** - For folder structure
5. **SkyBox Shares** - For sharing links

### 2.2 Configure Each Channel
For **EACH** channel:
1. Create new channel
2. Make it **PRIVATE**
3. Add your bot as **ADMINISTRATOR** with these permissions:
   - ✅ Post messages
   - ✅ Edit messages
   - ✅ Delete messages
   - ✅ Add subscribers

### 2.3 Get Channel IDs
Add this bot to get channel IDs: `@getidsbot`

For each channel:
1. Add `@getidsbot` as admin
2. Send any message in the channel
3. The bot will reply with channel ID (format: `-1001234567890`)
4. **Save each channel ID**

## 🔑 Step 3: Get Telegram API Credentials

### 3.1 Create Telegram App
1. Go to https://my.telegram.org/apps
2. Login with your phone number
3. Click "API Development Tools"
4. Fill in the form:
   - **App title**: `SkyBox Drive`
   - **Short name**: `skybox`
   - **Platform**: Web
   - **Description**: `Cloud storage application`
5. Save `api_id` and `api_hash`

## 📝 Step 4: Configure Environment

### 4.1 Copy Environment Template
```bash
cp .env.example .env.local
```

### 4.2 Fill in Your Values
Edit `.env.local`:

```env
# From BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=skybox_drive_YOUR_USERNAME_bot

# Channel IDs (from @getidsbot)
STORAGE_CHANNEL_ID=-1001234567890
DATABASE_CHANNEL_ID=-1001234567891
USERS_CHANNEL_ID=-1001234567892
FOLDERS_CHANNEL_ID=-1001234567893
SHARES_CHANNEL_ID=-1001234567894

# From my.telegram.org/apps
TELEGRAM_APP_ID=1234567
TELEGRAM_APP_HASH=abcdef1234567890abcdef1234567890

# Generate NextAuth secret
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4.3 Generate NextAuth Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

## ✅ Step 5: Test Setup

### 5.1 Test Bot Token
Send a GET request to check if bot token works:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe
```

### 5.2 Test Channel Access
Try sending a message to storage channel:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage" \
  -d "chat_id=<STORAGE_CHANNEL_ID>" \
  -d "text=Test message from SkyBox"
```

## 🎯 Final Checklist

Before deployment, ensure:
- [ ] Bot token is valid
- [ ] All 5 channels are created and private
- [ ] Bot is admin in all channels
- [ ] All channel IDs are correct
- [ ] Telegram API credentials are valid
- [ ] NextAuth secret is generated
- [ ] All environment variables are set

## ⚠️ Important Security Notes

1. **Keep bot token SECRET** - Anyone with this can control your bot
2. **Channels must be PRIVATE** - Public channels expose your files
3. **Bot must be ADMIN** - Otherwise it can't store files
4. **Don't share channel IDs** - They give access to your storage

## 🆘 Troubleshooting

### Bot Token Invalid
- Regenerate token with `/token` command to @BotFather
- Make sure no extra spaces in .env.local

### Channel Access Denied
- Ensure bot is admin with correct permissions
- Double-check channel IDs are negative numbers

### API Credentials Invalid
- Verify at https://my.telegram.org/apps
- Make sure API ID is a number, not string

## 🎉 You're Ready!

Once all steps are complete, you can proceed to deployment:
- For development: `npm run dev`
- For production: Follow DEPLOYMENT-GUIDE.md

---

**Need help?** Check our troubleshooting section or create an issue on GitHub.