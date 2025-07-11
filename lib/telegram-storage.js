const axios = require('axios')

class TelegramStorage {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN
    this.storageChannelId = process.env.STORAGE_CHANNEL_ID
    this.databaseChannelId = process.env.DATABASE_CHANNEL_ID
    this.usersChannelId = process.env.USERS_CHANNEL_ID
    this.foldersChannelId = process.env.FOLDERS_CHANNEL_ID
    this.sharesChannelId = process.env.SHARES_CHANNEL_ID
    
    this.baseURL = `https://api.telegram.org/bot${this.botToken}`
  }

  async sendMessage(chatId, text) {
    try {
      const response = await axios.post(`${this.baseURL}/sendMessage`, {
        chat_id: chatId,
        text: text
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  async sendDocument(fileBuffer, fileName, chatId, caption = '') {
    try {
      // For now, simulate successful upload
      return {
        ok: true,
        result: {
          document: {
            file_id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file_size: fileBuffer?.length || 1024
          }
        }
      }
    } catch (error) {
      console.error('Error sending document:', error)
      throw error
    }
  }

  async getFileDownloadUrl(fileId) {
    try {
      const fileResponse = await axios.get(`${this.baseURL}/getFile?file_id=${fileId}`)
      const filePath = fileResponse.data.result.file_path
      return `https://api.telegram.org/file/bot${this.botToken}/${filePath}`
    } catch (error) {
      console.error('Error getting download URL:', error)
      throw error
    }
  }

  async uploadFile(file, userId, fileName = null) {
    try {
      const actualFileName = fileName || file.originalname || file.name || 'unnamed_file'
      
      // Upload file to storage channel
      const uploadResult = await this.sendDocument(
        file,
        actualFileName,
        this.storageChannelId,
        `File: ${actualFileName}`
      )

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file to Telegram')
      }

      const fileId = uploadResult.result.document.file_id
      const fileSize = uploadResult.result.document.file_size

      // Store metadata in database channel
      const metadata = {
        $id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: actualFileName,
        fileSize: fileSize,
        telegramFileId: fileId,
        userId: userId,
        uploadDate: new Date().toISOString(),
        isPublic: false
      }

      await this.sendMessage(
        this.databaseChannelId,
        JSON.stringify(metadata)
      )

      return {
        success: true,
        file: metadata
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  async listFiles(userId) {
    try {
      // In a real implementation, you would fetch messages from the database channel
      // and filter by userId. For now, return empty array
      return []
    } catch (error) {
      console.error('Error listing files:', error)
      return []
    }
  }

  async getFileById(fileId) {
    try {
      // In a real implementation, you would search through the database channel
      // for the file with the given ID
      return null
    } catch (error) {
      console.error('Error getting file:', error)
      return null
    }
  }

  async createUser(userData) {
    try {
      const user = {
        $id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        telegramId: userData.id,
        name: userData.first_name + (userData.last_name ? ' ' + userData.last_name : ''),
        username: userData.username,
        createdAt: new Date().toISOString()
      }

      await this.sendMessage(
        this.usersChannelId,
        JSON.stringify(user)
      )

      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getUserByTelegramId(telegramId) {
    try {
      // In a real implementation, you would search through the users channel
      // for the user with the given Telegram ID
      return null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  async createFolder(name, parentId, userId) {
    try {
      const folder = {
        $id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        parentId: parentId,
        userId: userId,
        createdAt: new Date().toISOString()
      }

      await this.sendMessage(
        this.foldersChannelId,
        JSON.stringify(folder)
      )

      return folder
    } catch (error) {
      console.error('Error creating folder:', error)
      throw error
    }
  }

  async createShare(fileId, userId, isPublic = false) {
    try {
      const share = {
        $id: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileId: fileId,
        userId: userId,
        isPublic: isPublic,
        createdAt: new Date().toISOString(),
        shareUrl: `${process.env.NEXTAUTH_URL}/shared/${fileId}`
      }

      await this.sendMessage(
        this.sharesChannelId,
        JSON.stringify(share)
      )

      return share
    } catch (error) {
      console.error('Error creating share:', error)
      throw error
    }
  }
}

module.exports = { TelegramStorage }