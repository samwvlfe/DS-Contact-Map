import { fetchWithAuth } from "../utils/auth";
import { contactFromHubspot } from "../types/Contact";
import { geocodeContacts } from "./geocode";

const BASE = import.meta.env.VITE_API_URL;

// fetch filtered contacts and turn into contactFromHubspot shape
export async function fetchContacts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.statuses?.length) params.set("statuses", filters.statuses.join(","));
    if (filters.lifecycles?.length) params.set("lifecycles", filters.lifecycles.join(","));
    if (filters.locations?.length) params.set("locations", filters.locations.join(","));
    if (filters.ownerId) params.set("ownerId", filters.ownerId);

    const res = await fetchWithAuth(`${BASE}/api/contacts?${params}`);
    if (!res) return null;

    const data = await res.json();
    const contacts = (data.results ?? []).map(contactFromHubspot);
    console.log(`[api] received ${contacts.length} contacts from server:`, contacts);
    return geocodeContacts(contacts);
}

export async function createList(name, ids) {
    const res = await fetchWithAuth(`${BASE}/api/lists/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listName: name, contactIds: ids }),
    });
    if (!res) return null;

    return res.json();
}
