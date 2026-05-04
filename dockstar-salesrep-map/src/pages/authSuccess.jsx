import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    fetch('http://localhost:3002/auth/me', { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('Auth failed')
        return r.json()
      })
      .then(() => {
        window.location.href = '/'
      })
      .catch(() => {
        window.location.href = '/login?error=auth_failed'
      })
  }, [])

  return <p>Logging you in...</p>
}