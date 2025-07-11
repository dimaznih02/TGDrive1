import { TelegramStorage } from '../../../lib/telegram-storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { folderId = 'root', search } = req.query;
    const telegramStorage = new TelegramStorage();

    let files;
    if (search) {
      // Search files
      files = await telegramStorage.searchFiles(search, session.user.id);
    } else {
      // Get folder contents
      const contents = await telegramStorage.getFolderContents(folderId, session.user.id);
      files = contents.files;
    }

    res.status(200).json({
      success: true,
      files,
      total: files.length
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      error: 'Failed to list files', 
      message: error.message 
    });
  }
}