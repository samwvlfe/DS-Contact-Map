export function contactFromHubspot(raw) {
    const p = raw.properties;
    return {
        id: raw.id,
        firstName: p.firstname ?? null,
        lastName: p.lastname ?? null,
        email: p.email ?? null,
        phone: p.phone ?? null,
        company: p.company ?? null,
        lifecycleStage: p.lifecyclestage ?? null,
        leadStatus: p.hs_lead_status ?? null,
        ownerId: p.hs_owner_id ?? null,
        address: p.address ?? null,
        city: p.city ?? null,
        state: p.state ?? null,
        zip: p.zip ?? null,
        photoUrl: p.photo_url ?? p.twitterprofilephoto ?? null,
        lat: null,
        lng: null,
    };
}
