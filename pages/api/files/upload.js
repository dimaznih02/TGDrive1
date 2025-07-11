import { TelegramStorage } from '../../../lib/telegram-storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Parse form data
    const form = formidable({
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 4000000000, // 4GB
      multiples: false,
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Initialize Telegram storage
    const telegramStorage = new TelegramStorage();
    
    // Create file object compatible with our storage
    const fileData = {
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
      arrayBuffer: async () => {
        const fs = await import('fs');
        return fs.readFileSync(file.filepath);
      }
    };

    // Upload to Telegram
    const result = await telegramStorage.uploadFile(
      fileData,
      session.user.id,
      fields.folderId?.[0] || 'root'
    );

    // Clean up temp file
    const fs = await import('fs');
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      success: true,
      file: result
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    });
  }
}