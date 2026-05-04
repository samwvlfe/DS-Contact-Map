import { useState } from "react";
import styles from "./Filter.module.css";
import ContactList from "../ContactList";
import { LEAD_STATUSES, LIFECYCLE_STAGE } from "../../../shared/leadStatus";
import { fetchContacts } from "../../lib/api";
import { US_STATES } from "../../data/states";
import { useUser } from "../../context/UserContext";

const DEFAULT_FILTERS = { locations: [], statuses: [], lifecycles: [], ownerFilter: 'mine' };

export default function Filter({ onApply, onAdd, onRemove, selectedContacts }) {
    const [draft, setDraft] = useState(DEFAULT_FILTERS);
    const { user } = useUser();
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

    function toggleLifecycle(lifecycle) {
        setDraft(d => ({
            ...d,
            lifecycles: d.lifecycles.includes(lifecycle)
                ? d.lifecycles.filter(l => l !== lifecycle)
                : [...d.lifecycles, lifecycle],
        }));
    }

    const activeCount = draft.locations.length + draft.statuses.length + draft.lifecycles.length + (draft.ownerFilter === 'any' ? 1 : 0);

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
            const ownerId = draft.ownerFilter === 'mine' ? user?.userId : null;
            const results = await fetchContacts({ ...draft, ownerId });
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
                <div className="stack gap10">
                    <div className={`${styles.title} bold`}>CONTACT OWNER</div>
                    <div className={styles.toggle}>
                        <div
                            className={`${styles.toggleOption} ${draft.ownerFilter === 'mine' ? styles.toggleActive : ''}`}
                            onClick={() => setDraft(d => ({ ...d, ownerFilter: 'mine' }))}
                        >Just Mine</div>
                        <div
                            className={`${styles.toggleOption} ${draft.ownerFilter === 'any' ? styles.toggleActive : ''}`}
                            onClick={() => setDraft(d => ({ ...d, ownerFilter: 'any' }))}
                        >Any Owner</div>
                    </div>
                </div>
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
                    <div className={`${styles.title} bold`}>LEAD STATUS</div>
                    <div className={styles['grid-sel-cont']}>
                        {LEAD_STATUSES.map(s => (
                            <div
                                key={s.key}
                                className={`${styles['grid-item']} ${draft.statuses.includes(s.label) ? styles.selected : ""} row`}
                                onClick={() => toggleStatus(s.label)}
                            >
                                {s.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* LIFECYCLE STAGE FILTER */}
                <div className="stack gap10">
                    <div className={`${styles.title} bold`}>LIFECYCLE STAGE</div>
                    <div className={styles['grid-sel-cont']}>
                        {LIFECYCLE_STAGE.map(s => (
                            <div
                                key={s.key}
                                className={`${styles['grid-item']} ${draft.lifecycles.includes(s.label) ? styles.selected : ""} row`}
                                onClick={() => toggleLifecycle(s.label)}
                            >
                                {s.label}
                            </div>
                        ))}
                    </div>
                </div>

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
