import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('Auth failed')
        return r.json()
      })
      .then(() => {
        window.location.href = '/'
      })
      .catch(() => {
        window.location.href = 'https://ds-contact-map.onrender.com/auth/login'
      })
  }, [])

  return <p>Logging you in...</p>
}