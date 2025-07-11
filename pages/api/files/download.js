import { TelegramStorage } from '../../../lib/telegram-storage'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { fileId } = req.query
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' })
    }

    const telegramStorage = new TelegramStorage()
    
    // Get file metadata
    const file = await telegramStorage.getFileById(fileId)
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' })
    }

    // Check if user owns the file or has access
    if (file.userId !== session.user.id && !file.isPublic) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    // Get download URL from Telegram
    const downloadUrl = await telegramStorage.getFileDownloadUrl(file.telegramFileId)
    
    return res.status(200).json({ 
      success: true, 
      url: downloadUrl,
      fileName: file.fileName,
      fileSize: file.fileSize
    })

  } catch (error) {
    console.error('Download error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
}