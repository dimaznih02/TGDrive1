import NextAuth from 'next-auth';
import { TelegramStorage } from '../../../lib/telegram-storage';

export const authOptions = {
  providers: [
    {
      id: 'telegram',
      name: 'Telegram',
      type: 'custom',
      
      async authorize(credentials) {
        try {
          // Verify Telegram authentication data
          const telegramData = JSON.parse(credentials.telegramData);
          
          // Verify the data authenticity (implement hash verification)
          if (!verifyTelegramAuth(telegramData)) {
            throw new Error('Invalid Telegram authentication');
          }

          // Authenticate with Telegram storage
          const telegramStorage = new TelegramStorage();
          const user = await telegramStorage.authenticateUser(telegramData);
          
          return {
            id: user.$id,
            name: `${user.firstName} ${user.lastName || ''}`.trim(),
            email: user.email,
            image: telegramData.photo_url || null,
            telegramId: user.telegramId,
            username: user.username
          };
        } catch (error) {
          console.error('Telegram auth error:', error);
          return null;
        }
      }
    }
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.telegramId = user.telegramId;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.telegramId = token.telegramId;
        session.user.username = token.username;
      }
      return session;
    }
  },

  // Using default NextAuth pages for now
  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/auth/error'
  // },

  session: {
    strategy: 'jwt'
  },

  secret: process.env.NEXTAUTH_SECRET
};

// Verify Telegram authentication data
function verifyTelegramAuth(data) {
  // Implement proper Telegram auth verification
  // This should verify the hash according to Telegram's documentation
  // For now, return true (implement proper verification in production)
  return true;
}

export default NextAuth(authOptions);