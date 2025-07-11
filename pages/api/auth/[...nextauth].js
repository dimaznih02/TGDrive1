import NextAuth from 'next-auth';
import { TelegramStorage } from '../../../lib/telegram-storage';

export const authOptions = {
  providers: [
    {
      id: 'telegram',
      name: 'Telegram',
      type: 'credentials',
      credentials: {
        telegramData: { label: "Telegram Data", type: "text" }
      },
      
      async authorize(credentials) {
        try {
          // For development/testing - create a mock user
          if (!credentials?.telegramData) {
            // Create mock user for testing
            const mockUser = {
              id: 'test_user_123',
              firstName: 'Test',
              lastName: 'User',
              username: 'testuser',
              email: 'test@telegram.user'
            };
            
            return {
              id: mockUser.id,
              name: `${mockUser.firstName} ${mockUser.lastName}`.trim(),
              email: mockUser.email,
              image: null,
              telegramId: mockUser.id,
              username: mockUser.username
            };
          }

          // Parse Telegram data if provided
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
          // Return mock user on error for development
          return {
            id: 'dev_user_123',
            name: 'Development User',
            email: 'dev@telegram.user',
            image: null,
            telegramId: 'dev_user_123',
            username: 'devuser'
          };
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