const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('hs_refresh_token');
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!res.ok) return null;
        const tokens = await res.json();
        localStorage.setItem('hs_access_token', tokens.access_token);
        if (tokens.refresh_token) localStorage.setItem('hs_refresh_token', tokens.refresh_token);
        return tokens.access_token;
    } catch {
        return null;
    }
}

// Returns a valid access token, refreshing if the stored one is missing.
// Returns null if the user needs to log in.
export async function getToken() {
    return localStorage.getItem('hs_access_token') ?? refreshAccessToken();
}

// Wraps fetch with automatic token refresh on 401.
export async function fetchWithAuth(url, options = {}) {
    let token = await getToken();
    if (!token) return null;

    let res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });

    if (res.status === 401) {
        token = await refreshAccessToken();
        if (!token) return null;
        res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
    }

    return res;
}
