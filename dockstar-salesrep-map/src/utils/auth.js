const BASE = import.meta.env.VITE_API_URL;

function getSessionId() {
    return localStorage.getItem('session_id') ?? '';
}

async function refreshSession() {
    const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'x-session-id': getSessionId() },
    });
    return res.ok;
}

export async function fetchWithAuth(url, options = {}) {
    const headers = { ...options.headers, 'x-session-id': getSessionId() };
    let res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
        const refreshed = await refreshSession();
        if (!refreshed) return null;
        res = await fetch(url, { ...options, headers });
    }

    return res;
}
