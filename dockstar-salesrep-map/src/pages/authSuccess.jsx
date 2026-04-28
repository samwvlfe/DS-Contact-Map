// src/pages/AuthSuccess.jsx
import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      localStorage.setItem('hs_access_token', accessToken);
      localStorage.setItem('hs_refresh_token', refreshToken);
    }

    window.location.href = '/';
  }, []);

  return <p>Logging you in...</p>;
}