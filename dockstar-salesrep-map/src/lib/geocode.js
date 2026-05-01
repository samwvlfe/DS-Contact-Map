const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const GEOCODE_BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

/**
 * Build the best query string from a contact's location fields.
 * Prefers full address; falls back to city+state, then state alone.
 */
function buildQuery(contact) {
    const { address, city, state, zip } = contact;

    // Need at least a state to get a meaningful result
    const hasState = state && state.trim().length > 0;
    const hasAddress = address && address.trim().length > 0;

    if (hasAddress && hasState) {
        // Full address — most accurate
        const parts = [address.trim(), city, state, zip].filter(Boolean);
        return parts.join(', ');
    }

    if (city && hasState) {
        return `${city}, ${state}`;
    }

    if (hasState) {
        // State only — will land at the state's centroid
        return state.trim();
    }

    if (hasAddress) {
        // Address with no state (rare) — still worth trying
        return address.trim();
    }

    return null;
}

/**
 * Geocode a single contact using the Mapbox Geocoding API.
 * Returns { lat, lng } or null if geocoding fails.
 */
export async function geocodeContact(contact) {
    const query = buildQuery(contact);
    if (!query) return null;

    const url = `${GEOCODE_BASE}/${encodeURIComponent(query)}.json?country=us&limit=1&access_token=${MAPBOX_TOKEN}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        const feature = data.features?.[0];
        if (!feature) return null;

        const [lng, lat] = feature.center;
        return { lat, lng };
    } catch (err) {
        console.warn(`[geocode] Failed for contact ${contact.id}:`, err);
        return null;
    }
}

/**
 * Geocode an array of contacts in parallel.
 * Each contact is enriched with lat/lng fields (null if geocoding failed).
 */
export async function geocodeContacts(contacts) {
    return Promise.all(
        contacts.map(async (contact) => {
            const coords = await geocodeContact(contact);
            return {
                ...contact,
                lat: coords?.lat ?? null,
                lng: coords?.lng ?? null,
            };
        })
    );
}
