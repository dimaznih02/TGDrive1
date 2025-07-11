const TelegramBot = require('node-telegram-bot-api');

// Configuration - GANTI DENGAN DATA ANDA
const CONFIG = {
  BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
  CHANNELS: {
    STORAGE: 'YOUR_STORAGE_CHANNEL_ID',      // -1001234567890
    DATABASE: 'YOUR_DATABASE_CHANNEL_ID',    // -1001234567891  
    USERS: 'YOUR_USERS_CHANNEL_ID',          // -1001234567892
    FOLDERS: 'YOUR_FOLDERS_CHANNEL_ID',      // -1001234567893
    SHARES: 'YOUR_SHARES_CHANNEL_ID'         // -1001234567894
  }
};

// Test bot setup
async function testBotSetup() {
  console.log('🤖 Testing Telegram Bot Setup...\n');
  
  try {
    const bot = new TelegramBot(CONFIG.BOT_TOKEN, {polling: false});
    
    // Test 1: Bot Info
    console.log('📋 Test 1: Bot Information');
    const botInfo = await bot.getMe();
    console.log(`✅ Bot Name: ${botInfo.first_name}`);
    console.log(`✅ Bot Username: @${botInfo.username}`);
    console.log(`✅ Bot ID: ${botInfo.id}\n`);
    
    // Test 2: Channel Access
    console.log('📁 Test 2: Channel Access');
    
    for (const [name, channelId] of Object.entries(CONFIG.CHANNELS)) {
      try {
        if (channelId === 'YOUR_STORAGE_CHANNEL_ID') {
          console.log(`❌ ${name}: Please update channel ID`);
          continue;
        }
        
        const testMsg = await bot.sendMessage(channelId, `✅ Test message from ${name} channel - ${new Date().toISOString()}`);
        console.log(`✅ ${name}: Channel accessible (Message ID: ${testMsg.message_id})`);
        
        // Clean up test message
        setTimeout(() => {
          bot.deleteMessage(channelId, testMsg.message_id);
        }, 5000);
        
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Setup Test Complete!');
    
    // Test 3: File Upload Test
    console.log('\n📎 Test 3: File Upload Capability');
    try {
      const testFile = Buffer.from('Hello SkyBox Drive!', 'utf8');
      const fileMsg = await bot.sendDocument(CONFIG.CHANNELS.STORAGE, testFile, {}, {
        filename: 'test-file.txt',
        contentType: 'text/plain'
      });
      
      console.log('✅ File upload successful!');
      console.log(`✅ File ID: ${fileMsg.document.file_id}`);
      console.log(`✅ Message ID: ${fileMsg.message_id}`);
      
      // Save metadata test
      const metadata = {
        type: 'file',
        fileId: fileMsg.message_id,
        fileName: 'test-file.txt',
        fileSize: testFile.length,
        userId: 'test_user',
        uploadDate: new Date().toISOString(),
        telegramFileId: fileMsg.document.file_id
      };
      
      const metadataMsg = await bot.sendMessage(CONFIG.CHANNELS.DATABASE, JSON.stringify(metadata, null, 2));
      console.log('✅ Metadata saved successfully!');
      
    } catch (error) {
      console.log(`❌ File upload failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Bot setup failed:', error.message);
  }
}

// Run test
testBotSetup();

// Instructions
console.log(`
🚀 SETUP INSTRUCTIONS:

1. Ganti YOUR_BOT_TOKEN_HERE dengan Bot Token dari @BotFather
2. Ganti semua YOUR_CHANNEL_ID dengan Channel ID yang real
3. Pastikan bot sudah di-add ke semua channel sebagai admin
4. Run script: node test-telegram-setup.js

📋 CHECKLIST:
□ Bot Token valid
□ 5 Channels dibuat
□ Bot di-add ke semua channel
□ Bot punya admin permissions
□ All tests passed

Next: Clone SkyBox repository dan start integration!
`);