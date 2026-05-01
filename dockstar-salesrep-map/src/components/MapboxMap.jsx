import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const SOURCE_ID = 'contacts';
const LAYER_ID = 'contact-points';
const LAYER_HOVER_ID = 'contact-points-hover';

/** Convert enriched contacts to a Mapbox GeoJSON FeatureCollection */
function toGeoJSON(contacts) {
    return {
        type: 'FeatureCollection',
        features: contacts
            .filter(c => c.lat != null && c.lng != null)
            .map(c => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [c.lng, c.lat],
                },
                properties: {
                    id: c.id,
                    name: [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Unknown',
                    company: c.company || '',
                    leadStatus: c.leadStatus || '',
                    city: c.city || '',
                    state: c.state || '',
                },
            })),
    };
}

export default function MapboxMap({ contacts = [], center = [-80.0, 32.8], zoom = 5, onContactClick }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const initialCenter = useRef(center);
    const initialZoom = useRef(zoom);
    const mapLoaded = useRef(false);

    // Keep refs to latest contacts and callback so the load callback can access them
    const contactsRef = useRef(contacts);
    const onContactClickRef = useRef(onContactClick);
    useEffect(() => {
        contactsRef.current = contacts;
        onContactClickRef.current = onContactClick;
    }, [contacts, onContactClick]);

    // Initialize map once
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: initialCenter.current,
            zoom: initialZoom.current,
        });

        map.current.addControl(
            new mapboxgl.AttributionControl({ compact: true }),
            'top-left'
        );

        map.current.on('load', () => {
            mapLoaded.current = true;

            // Add GeoJSON source
            map.current.addSource(SOURCE_ID, {
                type: 'geojson',
                data: toGeoJSON(contactsRef.current),
            });

            // Base circle layer
            map.current.addLayer({
                id: LAYER_ID,
                type: 'circle',
                source: SOURCE_ID,
                paint: {
                    'circle-radius': 9,
                    'circle-color': '#2563eb',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.85,
                },
            });

            // Hover highlight layer (initially filters to nothing)
            map.current.addLayer({
                id: LAYER_HOVER_ID,
                type: 'circle',
                source: SOURCE_ID,
                filter: ['==', 'id', ''],
                paint: {
                    'circle-radius': 11,
                    'circle-color': '#1d4ed8',
                    'circle-stroke-width': 2.5,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 1,
                },
            });

            // Click → open contact panel
            map.current.on('click', LAYER_ID, (e) => {
                const id = e.features[0].properties.id;
                const contact = contactsRef.current.find(c => c.id === id);
                if (contact) onContactClickRef.current?.(contact);
            });

            // Hover effects
            map.current.on('mouseenter', LAYER_ID, (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                const id = e.features[0].properties.id;
                map.current.setFilter(LAYER_HOVER_ID, ['==', 'id', id]);
            });

            map.current.on('mouseleave', LAYER_ID, () => {
                map.current.getCanvas().style.cursor = '';
                map.current.setFilter(LAYER_HOVER_ID, ['==', 'id', '']);
            });
        });

        return () => {
            map.current?.remove();
            map.current = null;
            mapLoaded.current = false;
        };
    }, []);

    // Sync markers when contacts change
    useEffect(() => {
        if (!mapLoaded.current || !map.current) return;
        const source = map.current.getSource(SOURCE_ID);
        if (source) {
            source.setData(toGeoJSON(contacts));
        }
    }, [contacts]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
