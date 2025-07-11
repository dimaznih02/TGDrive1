import TelegramBot from 'node-telegram-bot-api';
import crypto from 'crypto';

export class TelegramStorage {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});
    this.channels = {
      storage: process.env.STORAGE_CHANNEL_ID,
      database: process.env.DATABASE_CHANNEL_ID,
      users: process.env.USERS_CHANNEL_ID,
      folders: process.env.FOLDERS_CHANNEL_ID,
      shares: process.env.SHARES_CHANNEL_ID
    };
  }

  // ==================== FILE OPERATIONS ====================

  async uploadFile(file, userId, folderId = null) {
    try {
      // Upload file to Telegram storage channel
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileMsg = await this.bot.sendDocument(this.channels.storage, fileBuffer, {}, {
        filename: file.name,
        contentType: file.type
      });

      // Create metadata
      const metadata = {
        $id: this.generateId(),
        type: 'file',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        folderId: folderId || 'root',
        userId: userId,
        uploadDate: new Date().toISOString(),
        telegramFileId: fileMsg.document.file_id,
        telegramMessageId: fileMsg.message_id,
        downloadUrl: await this.getFileDownloadUrl(fileMsg.document.file_id),
        bucketFileId: fileMsg.document.file_id // For compatibility
      };

      // Save metadata to database channel
      await this.saveMetadata(metadata);
      
      return metadata;
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async downloadFile(fileId) {
    try {
      const metadata = await this.getFileMetadata(fileId);
      if (!metadata) throw new Error('File not found');

      const fileUrl = await this.bot.getFileLink(metadata.telegramFileId);
      return { url: fileUrl, metadata };
    } catch (error) {
      throw new Error(`File download failed: ${error.message}`);
    }
  }

  async deleteFile(fileId, userId) {
    try {
      const metadata = await this.getFileMetadata(fileId);
      if (!metadata || metadata.userId !== userId) {
        throw new Error('File not found or access denied');
      }

      // Delete from storage channel
      await this.bot.deleteMessage(this.channels.storage, metadata.telegramMessageId);
      
      // Delete metadata
      await this.deleteMetadata(fileId);
      
      return { success: true };
    } catch (error) {
      throw new Error(`File delete failed: ${error.message}`);
    }
  }

  async renameFile(fileId, newName, userId) {
    try {
      const metadata = await this.getFileMetadata(fileId);
      if (!metadata || metadata.userId !== userId) {
        throw new Error('File not found or access denied');
      }

      metadata.fileName = newName;
      metadata.updatedAt = new Date().toISOString();
      
      await this.updateMetadata(fileId, metadata);
      return metadata;
    } catch (error) {
      throw new Error(`File rename failed: ${error.message}`);
    }
  }

  // ==================== FOLDER OPERATIONS ====================

  async createFolder(name, parentId = 'root', userId) {
    try {
      const folderId = this.generateId();
      const folderData = {
        $id: folderId,
        type: 'folder',
        name: name,
        parentId: parentId,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.saveFolderMetadata(folderData);
      return folderData;
    } catch (error) {
      throw new Error(`Folder creation failed: ${error.message}`);
    }
  }

  async getFolderContents(folderId, userId) {
    try {
      // Get files in folder
      const files = await this.getFilesByFolder(folderId, userId);
      
      // Get subfolders
      const folders = await this.getFoldersByParent(folderId, userId);
      
      return { files, folders };
    } catch (error) {
      throw new Error(`Get folder contents failed: ${error.message}`);
    }
  }

  async deleteFolder(folderId, userId) {
    try {
      // Check ownership
      const folder = await this.getFolderMetadata(folderId);
      if (!folder || folder.userId !== userId) {
        throw new Error('Folder not found or access denied');
      }

      // Delete all files in folder
      const files = await this.getFilesByFolder(folderId, userId);
      for (const file of files) {
        await this.deleteFile(file.$id, userId);
      }

      // Delete folder metadata
      await this.deleteFolderMetadata(folderId);
      
      return { success: true };
    } catch (error) {
      throw new Error(`Folder delete failed: ${error.message}`);
    }
  }

  // ==================== USER & AUTH OPERATIONS ====================

  async authenticateUser(telegramUser) {
    try {
      const userId = telegramUser.id.toString();
      const userData = {
        $id: userId,
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        email: telegramUser.email || `${telegramUser.username}@telegram.user`,
        lastLogin: new Date().toISOString(),
        accountId: userId // For compatibility with Appwrite
      };

      await this.saveUserMetadata(userData);
      return userData;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async getCurrentUser(userId) {
    try {
      return await this.getUserMetadata(userId);
    } catch (error) {
      throw new Error(`Get user failed: ${error.message}`);
    }
  }

  // ==================== SEARCH OPERATIONS ====================

  async searchFiles(query, userId) {
    try {
      const allFiles = await this.getAllUserFiles(userId);
      return allFiles.filter(file => 
        file.fileName.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // ==================== SHARING OPERATIONS ====================

  async shareFile(fileId, permissions, userId) {
    try {
      const shareId = this.generateId();
      const shareData = {
        $id: shareId,
        fileId: fileId,
        ownerId: userId,
        permissions: permissions,
        publicUrl: `${process.env.NEXTAUTH_URL}/api/public/${shareId}`,
        createdAt: new Date().toISOString()
      };

      await this.saveShareMetadata(shareData);
      return shareData;
    } catch (error) {
      throw new Error(`Share failed: ${error.message}`);
    }
  }

  async getPublicFile(shareId) {
    try {
      const shareData = await this.getShareMetadata(shareId);
      if (!shareData) throw new Error('Share not found');

      const fileData = await this.getFileMetadata(shareData.fileId);
      return { file: fileData, share: shareData };
    } catch (error) {
      throw new Error(`Get public file failed: ${error.message}`);
    }
  }

  // ==================== INTERNAL HELPER METHODS ====================

  async saveMetadata(data) {
    const message = `FILE_META:${JSON.stringify(data)}`;
    return await this.bot.sendMessage(this.channels.database, message);
  }

  async saveFolderMetadata(data) {
    const message = `FOLDER_META:${JSON.stringify(data)}`;
    return await this.bot.sendMessage(this.channels.folders, message);
  }

  async saveUserMetadata(data) {
    const message = `USER_META:${JSON.stringify(data)}`;
    return await this.bot.sendMessage(this.channels.users, message);
  }

  async saveShareMetadata(data) {
    const message = `SHARE_META:${JSON.stringify(data)}`;
    return await this.bot.sendMessage(this.channels.shares, message);
  }

  async getFileMetadata(fileId) {
    try {
      const messages = await this.getChannelMessages(this.channels.database);
      for (const msg of messages) {
        if (msg.text?.startsWith('FILE_META:')) {
          const data = JSON.parse(msg.text.replace('FILE_META:', ''));
          if (data.$id === fileId) return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getFolderMetadata(folderId) {
    try {
      const messages = await this.getChannelMessages(this.channels.folders);
      for (const msg of messages) {
        if (msg.text?.startsWith('FOLDER_META:')) {
          const data = JSON.parse(msg.text.replace('FOLDER_META:', ''));
          if (data.$id === folderId) return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getUserMetadata(userId) {
    try {
      const messages = await this.getChannelMessages(this.channels.users);
      for (const msg of messages) {
        if (msg.text?.startsWith('USER_META:')) {
          const data = JSON.parse(msg.text.replace('USER_META:', ''));
          if (data.$id === userId) return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getShareMetadata(shareId) {
    try {
      const messages = await this.getChannelMessages(this.channels.shares);
      for (const msg of messages) {
        if (msg.text?.startsWith('SHARE_META:')) {
          const data = JSON.parse(msg.text.replace('SHARE_META:', ''));
          if (data.$id === shareId) return data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getAllUserFiles(userId) {
    try {
      const messages = await this.getChannelMessages(this.channels.database);
      const files = [];
      
      for (const msg of messages) {
        if (msg.text?.startsWith('FILE_META:')) {
          const data = JSON.parse(msg.text.replace('FILE_META:', ''));
          if (data.userId === userId) files.push(data);
        }
      }
      
      return files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } catch (error) {
      return [];
    }
  }

  async getFilesByFolder(folderId, userId) {
    try {
      const allFiles = await this.getAllUserFiles(userId);
      return allFiles.filter(file => file.folderId === folderId);
    } catch (error) {
      return [];
    }
  }

  async getFoldersByParent(parentId, userId) {
    try {
      const messages = await this.getChannelMessages(this.channels.folders);
      const folders = [];
      
      for (const msg of messages) {
        if (msg.text?.startsWith('FOLDER_META:')) {
          const data = JSON.parse(msg.text.replace('FOLDER_META:', ''));
          if (data.parentId === parentId && data.userId === userId) {
            folders.push(data);
          }
        }
      }
      
      return folders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      return [];
    }
  }

  async getChannelMessages(channelId, limit = 100) {
    // Note: This is a simplified implementation
    // In real implementation, you might need to use Telegram's API
    // or maintain a local cache of messages
    try {
      // This would need actual implementation based on your bot's capabilities
      // For now, returning empty array - needs proper implementation
      return [];
    } catch (error) {
      return [];
    }
  }

  async getFileDownloadUrl(fileId) {
    try {
      return await this.bot.getFileLink(fileId);
    } catch (error) {
      return null;
    }
  }

  async updateMetadata(fileId, newData) {
    // Delete old metadata and save new one
    await this.deleteMetadata(fileId);
    await this.saveMetadata(newData);
  }

  async deleteMetadata(fileId) {
    // Implementation needed to find and delete specific metadata message
    // This is complex and would require storing message IDs with metadata
  }

  async deleteFolderMetadata(folderId) {
    // Similar to deleteMetadata but for folders
  }

  generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  // ==================== APPWRITE COMPATIBILITY LAYER ====================

  // These methods provide compatibility with existing Appwrite calls
  get databases() {
    return {
      listDocuments: async (databaseId, collectionId, queries = []) => {
        if (collectionId === 'files') {
          const userId = queries.find(q => q.includes('userId'))?.split('=')[1];
          const files = await this.getAllUserFiles(userId);
          return { documents: files, total: files.length };
        }
        return { documents: [], total: 0 };
      },
      
      createDocument: async (databaseId, collectionId, documentId, data) => {
        if (collectionId === 'files') {
          return await this.saveMetadata({ $id: documentId, ...data });
        }
        return data;
      },
      
      deleteDocument: async (databaseId, collectionId, documentId) => {
        if (collectionId === 'files') {
          return await this.deleteMetadata(documentId);
        }
        return { success: true };
      }
    };
  }

  get storage() {
    return {
      createFile: async (bucketId, fileId, file) => {
        return await this.uploadFile(file, fileId);
      },
      
      deleteFile: async (bucketId, fileId) => {
        return await this.deleteFile(fileId);
      },
      
      getFileDownload: async (bucketId, fileId) => {
        const result = await this.downloadFile(fileId);
        return result.url;
      },
      
      getFileView: async (bucketId, fileId) => {
        const result = await this.downloadFile(fileId);
        return result.url;
      }
    };
  }

  get account() {
    return {
      get: async () => {
        // Return current user from Telegram auth
        return this.currentUser || null;
      },
      
      createOAuth2Session: async (provider, successUrl, failureUrl) => {
        // Telegram OAuth implementation
        return { success: true };
      }
    };
  }
}