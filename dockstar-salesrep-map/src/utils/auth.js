const BASE = import.meta.env.VITE_API_URL;

async function refreshSession() {
    const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    });
    return res.ok;
}

export async function fetchWithAuth(url, options = {}) {
    let res = await fetch(url, { ...options, credentials: 'include' });

    if (res.status === 401) {
        const refreshed = await refreshSession();
        if (!refreshed) return null;
        res = await fetch(url, { ...options, credentials: 'include' });
    }

    return res;
}
