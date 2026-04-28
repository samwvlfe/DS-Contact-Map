import { useState } from "react";
import styles from "./Filter.module.css";

const LEAD_STATUSES = ["Connected", "Attempted", "New"];

export default function Filter({ filters, onApply }) {
    const [draft, setDraft] = useState(filters);
    const [locationInput, setLocationInput] = useState("");

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

    return (
        <div className={`${styles.filterCont} stack`}>
            <div className="stack gap10">
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

            <div className="stack gap10">
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

            <div className="stack gap10">
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

                <div className={styles['apply-filters-btn']} onClick={() => onApply(draft)}>
                    Apply Filters ({activeCount})
                </div>
            </div>
        </div>
    );
}
