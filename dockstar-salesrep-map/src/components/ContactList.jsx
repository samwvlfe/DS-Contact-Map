import styles from "./ContactList.module.css";
import { HS_TO_LABEL, HS_TO_CLASS } from "../../shared/leadStatus";

export default function ContactList({ contacts = [], selectedContacts = [], onAdd, onRemove }) {
    if (!contacts.length) return null;

    return (
        <div className={`${styles.listCont} stack gap10`}>
            {contacts.map(contact => {
                const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
                const location = [contact.city, contact.state].filter(Boolean).join(", ") || "—";
                const status = contact.leadStatus;
                const isSelected = selectedContacts.some(c => c.id === contact.id);

                return (
                    <div key={contact.id} className="row">
                        <div className={`${styles.listItem} row`}>
                            <div className={`${styles.meta} stack`}>
                                <div className={`${styles.name} bold`}>{name}</div>
                                <div className={styles.dist}>{location}</div>
                            </div>
                            <div className={styles.company}>{contact.company || "—"}</div>
                            {status && (
                                <div className={`${styles.status} ${HS_TO_CLASS[status] || ""} bold`}>
                                    {HS_TO_LABEL[status] || status}
                                </div>
                            )}
                        </div>
                        <div
                            className={styles.actionBtn}
                            onClick={() => isSelected ? onRemove(contact.id) : onAdd(contact)}
                        >
                            {isSelected ? (
                                <svg width="28" height="28" viewBox="0 0 28 28">
                                    <circle cx="14" cy="14" r="14" fill="var(--remove)"/>
                                    <line x1="8" y1="14" x2="20" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 28 28">
                                    <circle cx="14" cy="14" r="14" fill="var(--add)"/>
                                    <line x1="14" y1="8" x2="14" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                                    <line x1="8" y1="14" x2="20" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
