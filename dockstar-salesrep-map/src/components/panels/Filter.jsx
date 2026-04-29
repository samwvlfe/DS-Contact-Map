import { useState } from "react";
import styles from "./Filter.module.css";
import ContactList from "../ContactList";

const LEAD_STATUSES = ["Connected", "Attempted", "New"];

const DEFAULT_FILTERS = { locations: [], statuses: [], distance: 25 };

export default function Filter({ onApply, onAdd, onRemove, selectedContacts }) {
    const [draft, setDraft] = useState(DEFAULT_FILTERS);
    const [locationInput, setLocationInput] = useState("");
    const [contacts, setContacts] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(true);

    function addLocation(loc) {
        const trimmed = loc.trim();
        if (!trimmed || draft.locations.includes(trimmed)) return;
        setDraft(d => ({ ...d, locations: [...d.locations, trimmed] }));
        setLocationInput("");
    }

    function removeLocation(loc) {
        setDraft(d => ({ ...d, locations: d.locations.filter(l => l !== loc) }));
    }

    function toggleStatus(status) {
        setDraft(d => ({
            ...d,
            statuses: d.statuses.includes(status)
                ? d.statuses.filter(s => s !== status)
                : [...d.statuses, status],
        }));
    }

    const activeCount = draft.locations.length + draft.statuses.length + (draft.distance !== 25 ? 1 : 0);

    async function applyFilters() {
        const token = localStorage.getItem('hs_access_token');
        if (!token) {
            console.error('No hs_access_token in localStorage — user needs to log in');
            return;
        }

        const params = new URLSearchParams();
        if (draft.statuses.length) params.set('statuses', draft.statuses.join(','));

        console.log('Fetching contacts with params:', params.toString() || '(none)');

        try {
            const res = await fetch(`http://localhost:3002/api/contacts?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Response status:', res.status);
            const data = await res.json();
            console.log('Raw API response:', data);
            const results = data.results || [];
            console.log('Contacts to render:', results.length);
            setContacts(results);
            onApply(results);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        }
    }

    return (
        <>
        <div className={`${styles.filterCont} stack gap20`}>
            {filtersVisible && <div className={`${styles.collapse} stack gap20`}>
                {/* LOCATION FILTER */}
                <div>
                    <div className={styles.title}>LOCATION</div>
                    <div className={styles['location-sel-cont']}>
                        <input
                            className={styles['location-sel-input']}
                            type="text"
                            placeholder="Type a city or state, press Enter"
                            value={locationInput}
                            onChange={e => setLocationInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addLocation(locationInput)}
                            />
                        <div className={`${styles['location-dropdown']} ${locationInput.trim() ? styles.visible : ""}`}>
                            <div className={styles['dropdown-option']} onClick={() => addLocation(locationInput)}>
                                Add "{locationInput.trim()}"
                            </div>
                        </div>
                        <div className={styles['selected-locos']}>
                            {draft.locations.map(loc => (
                                <div key={loc} className={styles.loco} onClick={() => removeLocation(loc)}>
                                    {loc} ×
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LEAD STATUS FILTER */}
                <div>
                    <div className={styles.title}>LEAD STATUS</div>
                    <div className={styles['lead-status-sel-cont']}>
                        {LEAD_STATUSES.map(s => (
                            <div
                                key={s}
                                className={`${styles['lead-status']} ${draft.statuses.includes(s) ? styles.selected : ""}`}
                                onClick={() => toggleStatus(s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* DISTANCE FILTER */}
                <div>
                    <div className="row apart">
                        <div className={styles.title}>DISTANCE</div>
                        <div className={styles['sel-distance']}>{draft.distance} MI</div>
                    </div>
                    <input
                        className={styles['distance-slider']}
                        type="range"
                        min="0"
                        max="150"
                        step="5"
                        value={draft.distance}
                        onChange={e => setDraft(d => ({ ...d, distance: Number(e.target.value) }))}
                    />
                    <div className={styles['slider-markers']}>
                        <span>0</span>
                        <span>75</span>
                        <span>150</span>
                    </div>
                </div>
            </div>}
            <div className={`${styles.btnRow} row gap10`}>
                <div className={`${styles.applyFiltersBtn} _btn _orange`} onClick={() => { applyFilters(); setFiltersVisible(false); }}>
                    {filtersVisible ? `Apply Filters (${activeCount})` : `Applied Filters (${activeCount})`}
                </div>
                {!filtersVisible && <div className={`${styles.backToFiltersBtn} _btn`} onClick={() => setFiltersVisible(true)}>Edit Filters</div>}
            </div>
        </div>
        {contacts.length > 0 && (
            <div className={`${styles.filteredListCont} stack`}>
                <div className="row apart" style={{marginTop: 10, marginBottom: 10}}>
                    <div className={styles.fcTitle}>Filtered Contacts</div>
                    <div className="_btn _add" onClick={() => contacts.forEach(c => onAdd(c))}>Add All</div>
                </div>
                <ContactList contacts={contacts} onAdd={onAdd} onRemove={onRemove} selectedContacts={selectedContacts} />
            </div>
        )}
        </>
    );
}
