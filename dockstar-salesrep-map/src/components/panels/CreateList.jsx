import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CreateList.module.css";
import ContactList from "../ContactList";

export default function CreateList({ selectedContacts = [], onRemove, onClear }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        <div className={`${styles.listCont} stack gap10`}>
            <div className="row apart">
                <div className="_btn _add" onClick={() => setShowModal(true)}>Add List to HubSpot</div>
                <div className="_btn _remove" onClick={onClear}>Clear All</div>
            </div>
            <ContactList contacts={selectedContacts} selectedContacts={selectedContacts} onRemove={onRemove} />
        </div>

        {showModal && createPortal(
            <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
                <div className={`${styles.modal} stack gap20`} onClick={e => e.stopPropagation()}>
                    <div className={`${styles.modalTitle} bold`}>Name the List</div>
                    <input className={styles.modalInput} type="text" placeholder="List name..." />
                    <div className="_btn _add" onClick={() => setShowModal(false)}>Add to HubSpot</div>
                </div>
            </div>,
            document.body
        )}
        </>
    )
}