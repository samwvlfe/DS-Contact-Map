import styles from './Contact.module.css';
import { HS_TO_LABEL } from '../../../shared/leadStatus';

export default function Contact({ contact, onAdd }) {
    if (!contact) return null;

    const name = [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '—';

    const fields = [
        { label: 'Phone Number', value: contact.phone, href: contact.phone ? `tel:${contact.phone}` : null },
        { label: 'Email',        value: contact.email, href: contact.email ? `mailto:${contact.email}` : null },
        { label: 'Company',      value: contact.company },
        { label: 'Lifecycle Stage', value: contact.lifecycleStage },
        { label: 'Lead Status',  value: HS_TO_LABEL[contact.leadStatus] ?? contact.leadStatus },
        { label: 'Street Address', value: contact.address },
        { label: 'City',         value: contact.city },
        { label: 'State / Region', value: contact.state },
        { label: 'Postal Code',  value: contact.zip },
    ];

    return (
        <div className="stack gap10">
            <div className="row apart">
                <div className={`${styles.name} h1`}>{name}</div>
                <div className="_btn _add" onClick={() => onAdd?.(contact)}>Add to List</div>
            </div>
            <div className={`${styles.infoCont} stack`}>
                {fields.map(({ label, value, href }) => {
                    if (!value) return null;
                    return (
                        <div key={label} className={`${styles.infoLine} stack`}>
                            <div className={styles.infoTitle}>{label}</div>
                            {href
                                ? <a className={styles.info} href={href} style={{ textDecoration: 'underline' }}>{value}</a>
                                : <div className={styles.info}>{value}</div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
