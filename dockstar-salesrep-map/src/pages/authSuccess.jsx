import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    if (sessionId) localStorage.setItem('session_id', sessionId)

    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: { 'x-session-id': sessionId }
    })
      .then(r => {
        if (!r.ok) throw new Error('Auth failed')
        return r.json()
      })
      .then(() => {
        window.location.href = '/'
      })
      .catch(() => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`
      })
  }, [])

  return <p>Logging you in...</p>
}
