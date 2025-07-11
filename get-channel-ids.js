const TelegramBot = require('node-telegram-bot-api');

// Ganti dengan Bot Token Anda
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// Channel usernames yang sudah dibuat
const CHANNEL_USERNAMES = [
  'skybox_storage_channel',
  'skybox_database_channel', 
  'skybox_users_channel',
  'skybox_folders_channel',
  'skybox_shares_channel'
];

async function getChannelIDs() {
  console.log('🔍 Getting Channel IDs automatically...\n');
  
  try {
    const bot = new TelegramBot(BOT_TOKEN, {polling: false});
    
    console.log('📋 COPY THESE VALUES TO YOUR CONFIG:\n');
    console.log('const CONFIG = {');
    console.log(`  BOT_TOKEN: '${BOT_TOKEN}',`);
    console.log('  CHANNELS: {');
    
    const channelNames = ['STORAGE', 'DATABASE', 'USERS', 'FOLDERS', 'SHARES'];
    
    for (let i = 0; i < CHANNEL_USERNAMES.length; i++) {
      const username = CHANNEL_USERNAMES[i];
      const name = channelNames[i];
      
      try {
        // Try to get chat info
        const chat = await bot.getChat(`@${username}`);
        console.log(`    ${name}: '${chat.id}',  // ${chat.title}`);
      } catch (error) {
        console.log(`    ${name}: 'ERROR_${username}',  // ❌ ${error.message}`);
      }
    }
    
    console.log('  }');
    console.log('};');
    
    console.log('\n📝 ALTERNATIVE METHOD:');
    console.log('Jika ada error, forward pesan dari channel ke bot ini:');
    console.log('Bot akan reply dengan Channel ID');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🛠️ MANUAL METHOD:');
    console.log('1. Buka web.telegram.org');
    console.log('2. Klik channel');
    console.log('3. Lihat URL: https://web.telegram.org/k/#-1001234567890');
    console.log('4. Copy angka setelah # (termasuk tanda minus)');
  }
}

// Method alternatif: Bot listener untuk get ID via forward
function startIdListener() {
  const bot = new TelegramBot(BOT_TOKEN, {polling: true});
  
  console.log('\n🎧 Bot listening for forwarded messages...');
  console.log('Forward pesan dari channel mana saja ke bot untuk get ID\n');
  
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const chatTitle = msg.chat.title || msg.chat.first_name || 'Unknown';
    
    if (chatType === 'channel' || chatType === 'supergroup') {
      console.log(`📁 Channel ID: ${chatId} (${chatTitle})`);
      bot.sendMessage(chatId, `✅ Channel ID: ${chatId}`);
    } else if (chatType === 'private') {
      if (msg.forward_from_chat) {
        const forwardedChatId = msg.forward_from_chat.id;
        const forwardedTitle = msg.forward_from_chat.title;
        
        console.log(`📁 Forwarded Channel ID: ${forwardedChatId} (${forwardedTitle})`);
        bot.sendMessage(chatId, `✅ Channel ID: ${forwardedChatId}\nChannel: ${forwardedTitle}`);
      } else {
        bot.sendMessage(chatId, 'Forward pesan dari channel untuk mendapatkan ID nya');
      }
    }
  });
  
  // Stop after 60 seconds
  setTimeout(() => {
    bot.stopPolling();
    console.log('\n⏹️ Stopped listening. Run script again if needed.');
  }, 60000);
}

// Main execution
if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
  console.log('❌ Please update BOT_TOKEN first!');
  console.log('Get it from @BotFather on Telegram');
} else {
  // Try automatic method first
  getChannelIDs().then(() => {
    console.log('\n🎧 Starting ID listener method...');
    console.log('Forward any message from your channels to the bot');
    startIdListener();
  });
}

console.log(`
🔧 SETUP INSTRUCTIONS:

1. Update BOT_TOKEN with your real token
2. Make sure channel usernames match:
   - skybox_storage_channel
   - skybox_database_channel  
   - skybox_users_channel
   - skybox_folders_channel
   - skybox_shares_channel
3. Run: node get-channel-ids.js
4. Copy the output to your main config

📱 ALTERNATIVE: Forward messages from channels to bot to get IDs
`);