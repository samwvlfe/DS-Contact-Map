import { useState } from "react";
import styles from "./Filter.module.css";
import ContactList from "../ContactList";
import { LEAD_STATUSES } from "../../../shared/leadStatus";
import { fetchContacts } from "../../lib/api";
import { US_STATES } from "../../data/states";

const DEFAULT_FILTERS = { locations: [], statuses: [], distance: 25 };

export default function Filter({ onApply, onAdd, onRemove, selectedContacts }) {
    const [draft, setDraft] = useState(DEFAULT_FILTERS);
    const [locationInput, setLocationInput] = useState("");
    const [contacts, setContacts] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [fetchError, setFetchError] = useState(null);

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

    const trimmed = locationInput.trim();
    const q = trimmed.toLowerCase();
    const stateSuggestions = trimmed
        ? US_STATES.filter(s =>
            s.name.toLowerCase().includes(q) || s.abbr.toLowerCase() === q
          ).slice(0, 5)
        : [];

    async function applyFilters() {
        setFetchError(null);
        try {
            const results = await fetchContacts(draft);
            if (!results) {
                setFetchError('Not logged in — please reconnect to HubSpot.');
                return;
            }
            setContacts(results);
            onApply(results);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
            setFetchError('Failed to fetch contacts. Check the server console for details.');
        }
    }

    return (
        <>
        <div className={`${styles.filterCont} stack gap20`}>
            {filtersVisible && <div className="stack gap20">
                {/* LOCATION FILTER */}
                <div className="stack gap10">
                    <div className={`${styles.title} bold`}>LOCATION</div>
                    <div className={`${styles['location-sel-cont']} stack`}>
                        <input
                            className={styles['location-sel-input']}
                            type="text"
                            placeholder="Type a state, press Enter"
                            value={locationInput}
                            onChange={e => setLocationInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addLocation(locationInput)}
                            />
                        <div className={`${styles['location-dropdown']} ${trimmed ? styles.visible : ""} stack`}>
                            {stateSuggestions.map(s => (
                                <div key={s.abbr} className={styles['dropdown-option']} onClick={() => addLocation(s.name)}>
                                    {s.name} <span className={styles['dropdown-abbr']}>{s.abbr}</span>
                                </div>
                            ))}
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
                <div className="stack gap10">
                    <div className={styles.title}>LEAD STATUS</div>
                    <div className={styles['lead-status-sel-cont']}>
                        {LEAD_STATUSES.map(s => (
                            <div
                                key={s.key}
                                className={`${styles['lead-status']} ${draft.statuses.includes(s.label) ? styles.selected : ""} row`}
                                onClick={() => toggleStatus(s.label)}
                            >
                                {s.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* DISTANCE FILTER */}
                {/* <div className="stack gap10">
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
                    <div className={`${styles['slider-markers']} row`}>
                        <span>0</span>
                        <span>75</span>
                        <span>150</span>
                    </div>
                </div> */}
            </div>}
            {fetchError && <div style={{ color: 'var(--remove, red)', fontSize: 13 }}>{fetchError}</div>}
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
                    <div className={`${styles.fcTitle} bold`}>Filtered Contacts</div>
                    <div className="_btn _add" onClick={() => contacts.forEach(c => onAdd(c))}>Add All</div>
                </div>
                <ContactList contacts={contacts} onAdd={onAdd} onRemove={onRemove} selectedContacts={selectedContacts} />
            </div>
        )}
        </>
    );
}
