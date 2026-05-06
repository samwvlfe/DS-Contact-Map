export const LEAD_STATUSES = [
    { key: 'connected',   label: 'Connected',   hsValue: 'CONNECTED',            className: '_connected'   },
    { key: 'attempted',   label: 'Attempted',   hsValue: 'ATTEMPTED_TO_CONTACT', className: '_attempted'   },
    { key: 'new',         label: 'New',         hsValue: 'NEW',                  className: '_new'         },
    { key: 'unqualified', label: 'Unqualified', hsValue: 'UNQUALIFIED',          className: '_unqual'      }
];
export const LIFECYCLE_STAGE = [
    { key: 'customer',    label: 'Customer',                 hsValue: 'CUSTOMER',                 className: '_customer'    },
    { key: 'opportunity', label: 'Opportunity',              hsValue: 'OPPORTUNITY',              className: '_opportunity' },
    { key: 'lead',        label: 'Lead',                     hsValue: 'LEAD',                     className: '_lead'        },
    { key: 'mqlead',      label: 'Marketing Qualified Lead', hsValue: 'MARKETING QUALIFIED LEAD', className: '_lead'        }
]

const ALL_STATUSES = [...LEAD_STATUSES, ...LIFECYCLE_STAGE];

// "Connected" -> "CONNECTED"  (works for both lead status and lifecycle)
export const LABEL_TO_HS = Object.fromEntries(ALL_STATUSES.map(s => [s.label, s.hsValue]));

// "CONNECTED" -> "Connected"
export const HS_TO_LABEL = Object.fromEntries(ALL_STATUSES.map(s => [s.hsValue, s.label]));

// "CONNECTED" -> "_connected"
export const HS_TO_CLASS = Object.fromEntries(ALL_STATUSES.map(s => [s.hsValue, s.className]));
