import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import { toast, Toaster } from 'react-hot-toast'

export default function Home() {
  const { data: session, status } = useSession()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (session) {
      loadFiles()
    }
  }, [session])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/files/list')
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
      }
    } catch (error) {
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 4000000000) { // 4GB limit
      toast.error('File size must be less than 4GB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        toast.success('File uploaded successfully!')
        loadFiles() // Refresh file list
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`/api/files/download?fileId=${fileId}`)
      const data = await response.json()
      
      if (data.success) {
        // Open download URL in new tab
        window.open(data.url, '_blank')
      } else {
        toast.error('Download failed')
      }
    } catch (error) {
      toast.error('Download failed')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>SkyBox Drive - Login</title>
        </Head>
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              SkyBox Drive
            </h1>
            <p className="text-gray-600 mb-6">
              Unlimited cloud storage powered by Telegram
            </p>
            <button
              onClick={() => signIn('telegram')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login with Telegram
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>SkyBox Drive</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SkyBox Drive</h1>
              <span className="ml-2 text-sm text-green-600 font-medium">FREE & Unlimited</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Upload Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Up to 4GB per file
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Files</h2>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="text-gray-500">Loading files...</div>
              </div>
            ) : files.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-500">No files uploaded yet</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {files.map((file) => (
                  <div key={file.$id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {file.fileName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(file.fileSize / (1024 * 1024)).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFileDownload(file.$id, file.fileName)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>SkyBox Drive - FREE Unlimited Cloud Storage powered by Telegram</p>
            <p className="mt-1">Save $72-216+ per year vs Google Drive!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}