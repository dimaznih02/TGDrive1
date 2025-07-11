import { useState, useEffect } from 'react'
import { getSession, signIn, getProviders } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function SignIn({ providers }) {
  const router = useRouter()
  const { callbackUrl = '/' } = router.query
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [callbackUrl, router])

  // Telegram Login Widget implementation
  useEffect(() => {
    // Create Telegram Login Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_BOT_USERNAME || 'YOUR_BOT_USERNAME')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/callback/telegram`)
    script.setAttribute('data-request-access', 'write')
    
    const container = document.getElementById('telegram-login')
    if (container) {
      container.appendChild(script)
    }

    return () => {
      // Cleanup
      if (container && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const handleTelegramAuth = async (telegramData) => {
    setLoading(true)
    try {
      const result = await signIn('telegram', {
        telegramData: JSON.stringify(telegramData),
        callbackUrl,
        redirect: false
      })

      if (result?.error) {
        console.error('Authentication error:', result.error)
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Make the callback function available globally for Telegram widget
  useEffect(() => {
    window.onTelegramAuth = handleTelegramAuth
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Sign In - SkyBox Drive</title>
      </Head>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-blue-500">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 2v10h12V6H4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to SkyBox Drive
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Unlimited cloud storage powered by Telegram
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                Sign in with your Telegram account to get started
              </p>
              
              {/* Telegram Login Widget Container */}
              <div id="telegram-login" className="flex justify-center"></div>
              
              {/* Alternative manual signin button */}
              <div className="mt-6">
                <button
                  onClick={() => signIn('telegram', { callbackUrl })}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Signing in...' : 'Sign in with Telegram'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  
  return {
    props: { providers }
  }
}