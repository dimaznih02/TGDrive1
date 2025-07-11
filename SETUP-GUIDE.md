# 🚀 SkyBox Telegram Backend Setup Guide

**Transform SkyBox into a FREE, UNLIMITED Google Drive Clone powered by Telegram!**

## 📋 Prerequisites

- Telegram account
- Node.js installed
- Basic terminal/command line knowledge

---

## 🤖 STEP 1: Create Telegram Bot

### A. Talk to BotFather
1. Open Telegram and search: `@BotFather`
2. Start chat and send: `/newbot`
3. Choose bot name: `SkyBox Drive Bot`
4. Choose username: `skybox_drive_bot` (or available alternative)
5. **SAVE THE TOKEN** - looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### B. Configure Bot Settings
Send these commands to @BotFather:

```
/setprivacy
Choose your bot → Disable

/setjoingroups  
Choose your bot → Enable

/setcommands
Choose your bot → Send this list:
```

```
upload - Upload file to drive
search - Search files and folders
folder - Create new folder
download - Download file by ID
share - Share file or folder
stats - Show storage statistics
backup - Create database backup
help - Show help menu
```

---

## 📁 STEP 2: Create Telegram Channels

Create **5 Private Channels** with these exact details:

### Channel 1: File Storage
```
Name: SkyBox Storage
Description: File storage for SkyBox Drive
Type: Private Channel
```

### Channel 2: Database
```
Name: SkyBox Database
Description: Metadata and file information
Type: Private Channel  
```

### Channel 3: Users
```
Name: SkyBox Users
Description: User authentication and sessions
Type: Private Channel
```

### Channel 4: Folders
```
Name: SkyBox Folders  
Description: Folder structure and hierarchy
Type: Private Channel
```

### Channel 5: Sharing
```
Name: SkyBox Shares
Description: File sharing and permissions
Type: Private Channel
```

---

## 🔧 STEP 3: Configure Bot Permissions

For **each channel** created:

1. Open the channel
2. Click **"Add Members"**
3. Search for your bot: `@skybox_drive_bot`
4. Add bot as **Admin** with these permissions:
   - ✅ Post Messages
   - ✅ Edit Messages
   - ✅ Delete Messages
   - ✅ Post Files
   - ✅ Invite Users via Link

---

## 💻 STEP 4: Run Setup Scripts

### A. Install Dependencies
```bash
npm install
```

### B. Get Channel IDs
1. Edit `get-channel-ids.js`
2. Replace `YOUR_BOT_TOKEN_HERE` with your real bot token
3. Run setup:
```bash
npm run setup
```

### C. Test Configuration
1. Copy the generated config to `test-telegram-setup.js`
2. Run test:
```bash
npm run test
```

**Expected Output:**
```
✅ Bot Name: SkyBox Drive Bot
✅ Bot Username: @skybox_drive_bot
✅ STORAGE: Channel accessible
✅ DATABASE: Channel accessible  
✅ USERS: Channel accessible
✅ FOLDERS: Channel accessible
✅ SHARES: Channel accessible
✅ File upload successful!
✅ Metadata saved successfully!
```

---

## 🎯 STEP 5: Troubleshooting

### Common Issues:

**❌ "Chat not found"**
- Bot not added to channel
- Channel username wrong
- Bot not admin

**❌ "Bot was blocked by the user"**  
- Enable privacy settings
- Add bot as admin properly

**❌ "Not enough rights"**
- Check admin permissions
- Enable all required permissions

**❌ Token errors**
- Double-check bot token
- No extra spaces in token

### Get Channel IDs Manually:
1. Open web.telegram.org
2. Navigate to channel
3. Check URL: `https://web.telegram.org/k/#-1001234567890`
4. Copy number after `#` (including minus sign)

---

## 📊 STEP 6: Verify Complete Setup

Your final configuration should look like:

```javascript
const CONFIG = {
  BOT_TOKEN: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
  CHANNELS: {
    STORAGE: '-1001234567890',
    DATABASE: '-1001234567891',  
    USERS: '-1001234567892',
    FOLDERS: '-1001234567893',
    SHARES: '-1001234567894'
  }
};
```

**✅ Checklist:**
- [ ] Bot created and configured
- [ ] 5 channels created
- [ ] Bot added to all channels as admin
- [ ] All permissions granted
- [ ] Channel IDs collected
- [ ] Test script passes all checks
- [ ] File upload/download works

---

## 🚀 NEXT STEPS

Once setup is complete:

1. **Clone SkyBox Repository**
   ```bash
   git clone https://github.com/dimzskytes01/SkyBox_A-Google-Drive-Clone.git
   ```

2. **Replace Appwrite with Telegram Backend**
   - Swap out Appwrite SDK calls
   - Integrate Telegram storage API
   - Update authentication system

3. **Deploy and Test**
   - Test all Google Drive features
   - Verify file operations
   - Test sharing and permissions

---

## 💡 Configuration Summary

| Component | Purpose | Channel |
|-----------|---------|---------|
| 🤖 **Bot** | API interface | Main bot |
| 📁 **Storage** | File storage | Channel 1 |
| 🗄️ **Database** | Metadata | Channel 2 |
| 👥 **Users** | Authentication | Channel 3 |
| 📂 **Folders** | Structure | Channel 4 |
| 🔗 **Shares** | Permissions | Channel 5 |

---

## 🎉 Benefits After Setup

- ✅ **$0/month cost** (vs $15-50+ Appwrite)
- ✅ **4GB file limit** (vs 100MB Appwrite)  
- ✅ **Unlimited storage** (vs limited tiers)
- ✅ **99.99% uptime** (Telegram infrastructure)
- ✅ **Global CDN** (faster downloads)
- ✅ **Real-time sync** (Telegram webhooks)
- ✅ **Mobile notifications** (via Telegram)
- ✅ **No vendor lock-in** (own your data)

---

## 🆘 Need Help?

If you encounter any issues:

1. Double-check each step in this guide
2. Verify bot permissions in all channels  
3. Test with manual Channel ID method
4. Run test script to identify specific problems

**Ready to build the most powerful FREE Google Drive clone? Let's go! 🔥**