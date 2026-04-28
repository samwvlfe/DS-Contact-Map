import styles from './Contact.module.css';

export default function Contact({ contact, onClick, selected }) {
    return (
        <div className="stack gap10">
            <div className="row apart">
                <div className={`${styles.name} h1`} id='name'>Sam Wolfe</div>
                <div className={`${styles['qv-control']} _add`}>Add Contact To List</div>
            </div>
            <div className={`${styles.infoCont} stack`}>
                <a className={`${styles.infoLine} stack`} href="tel:7576155020">
                    <div className={styles.infoTitle}>Phone Number</div>
                    <div className={styles.info} style={{textDecoration: "underline"}}>757-615-5020</div>
                </a>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Email</div>
                    <div className={styles.info}>r.sam.wolfe@gmail.com</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Company Name</div>
                    <div className={styles.info}>Spry Manufacturing</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Contact Owner</div>
                    <div className={styles.info}>Jason Tyner</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>LifeCycle Stage</div>
                    <div className={styles.info}>Lead</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Lead Status</div>
                    <div className={styles.info}>NEW</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Street Address</div>
                    <div className={styles.info}>6428 Olde Bullocks Circe</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>City</div>
                    <div className={styles.info}>Suffolk</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>State/Region</div>
                    <div className={styles.info}>VA</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Postal Code</div>
                    <div className={styles.info}>23435</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Notes</div>
                    <div className={styles.info}>He's the best</div>
                </div>
                <div className={`${styles.infoLine} stack`}>
                    <div className={styles.infoTitle}>Messages</div>
                    <div className={styles.info}>Wants to buy 100 Dock Levelers</div>
                </div>
            </div>
        </div>
    )
}