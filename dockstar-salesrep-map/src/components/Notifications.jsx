import styles from "./Notifications.module.css";

export default function Notifications({ notifications }) {
    if (!notifications.length) return null;

    return (
        <div className={styles.container}>
            {notifications.map(n => (
                <div key={n.id} className={`${styles.toast} ${styles[n.type]}`}>
                    {n.message}
                </div>
            ))}
        </div>
    );
}
