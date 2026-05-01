export const LEAD_STATUSES = [
    { key: 'connected',  label: 'Connected', hsValue: 'CONNECTED',              className: '_connected' },
    { key: 'attempted',  label: 'Attempted', hsValue: 'ATTEMPTED_TO_CONTACT',   className: '_attempted' },
    { key: 'new',        label: 'New',        hsValue: 'NEW',                    className: '_new'       },
];

// "Connected" -> "CONNECTED"
export const LABEL_TO_HS = Object.fromEntries(LEAD_STATUSES.map(s => [s.label, s.hsValue]));

// "CONNECTED" -> "Connected"
export const HS_TO_LABEL = Object.fromEntries(LEAD_STATUSES.map(s => [s.hsValue, s.label]));

// "CONNECTED" -> "_connected"
export const HS_TO_CLASS = Object.fromEntries(LEAD_STATUSES.map(s => [s.hsValue, s.className]));
