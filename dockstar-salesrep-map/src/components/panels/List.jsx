import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./List.module.css";

export default function List() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        <div className='stack gap10'>
            <div className="row apart">
                <div className={`${styles.control} _add`} onClick={() => setShowModal(true)}>Add List to HubSpot</div>
                <div className={`${styles.control} _remove`}>Clear All</div>
            </div>
            <div className="stack gap10">
                <div className={`${styles.listItemCont} row`}>
                    <div className={`${styles.listItem} row apart`}>
                        <div className={`${styles.meta} stack`}>
                            <div className={styles.name}>Sam Wolfe</div>
                            <div className={styles.dist}>2.0 MI</div>
                        </div>
                        <div className="gap10 row">
                            <div className={`${styles.company}`}>Something Manufacturing LLC</div>
                            <div className={`${styles.status} _connected`}>CONNECTED</div>                    </div>
                    </div>
                    <div className={styles.removeBtn}>
                        <svg width="28" height="28" viewBox="0 0 28 28">
                            <circle cx="14" cy="14" r="14" fill="var(--remove)"/>
                            <line x1="8" y1="14" x2="20" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        {showModal && createPortal(
            <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalTitle}>Name the List</div>
                    <input className={styles.modalInput} type="text" placeholder="List name..." />
                    <div className={`${styles.control} _add`} onClick={() => setShowModal(false)}>Add to HubSpot</div>
                </div>
            </div>,
            document.body
        )}
        </>
    )
}