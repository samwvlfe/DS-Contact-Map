import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CreateList.module.css";
import ContactList from "../ContactList";
import { createList } from "../../lib/api";

export default function CreateList({ selectedContacts = [], onRemove, onClear, onNotify }) {
    const [showModal, setShowModal] = useState(false);
    const [listName, setListName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function openModal() {
        setListName("");
        setError(null);
        setShowModal(true);
    }

    async function handleSubmit() {
        if (!listName.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const ids = selectedContacts.map(c => c.id);
            const result = await createList(listName.trim(), ids);
            if (!result || result.error) {
                setError(result?.error ?? "Failed to create list.");
                onNotify?.("Failed to create list.", "error");
            } else {
                setShowModal(false);
                onClear();
                onNotify?.(`List "${result.listName}" added to HubSpot`);
            }
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className={`${styles.listCont} stack gap10`}>
            <div className="row apart">
                <div className="_btn _add" onClick={openModal}>Add List to HubSpot</div>
                <div className="_btn _remove" onClick={onClear}>Clear All</div>
            </div>
            {selectedContacts.length === 0
                ? <div className={styles.empty}>Add contacts to list</div>
                : <ContactList contacts={selectedContacts} selectedContacts={selectedContacts} onRemove={onRemove} />
            }
        </div>

        {showModal && createPortal(
            <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
                <div className={`${styles.modal} stack gap20`} onClick={e => e.stopPropagation()}>
                    <div className={`${styles.modalTitle} bold`}>Name the List</div>
                    <input
                        className={styles.modalInput}
                        type="text"
                        placeholder="List name..."
                        value={listName}
                        onChange={e => setListName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                        autoFocus
                    />
                    {error && <div className={styles.modalError}>{error}</div>}
                    <div
                        className={`_btn _add ${loading ? styles.disabled : ""}`}
                        onClick={handleSubmit}
                    >
                        {loading ? "Adding..." : "Add to HubSpot"}
                    </div>
                </div>
            </div>,
            document.body
        )}
        </>
    )
}
