import { useEffect, useState, useRef } from 'react'
//useSearchParaams is a React Router hook that allows you to read the query string values from the ?code=... part of the URL.
//useNavigate is a React Router hook that lets you redirect without using a <link> which needs to be clicked on. (used to redirect after login success)
import { useNavigate, useSearchParams } from 'react-router-dom'

function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const code = searchParams.get('code')

    if (!code) {
      setError('No authorization code found in URL.')
      return
    }

    fetch('/api/hackatime-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('hackatime-token', data.access_token)
          navigate('/')
        } else {
          setError('Failed to get access token.')
        }
      })
      .catch((err) => setError(err.message))
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="app">
        <p>Something went wrong connecting to Hackatime: {error}</p>
      </div>
    )
  }

  return (
    <div className="app">
      <p>Connecting to Hackatime...</p>
    </div>
  )
}

export default AuthCallbackPage