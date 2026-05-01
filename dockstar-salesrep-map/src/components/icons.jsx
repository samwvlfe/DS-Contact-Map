export function ChevronUp() {
    return (
        <svg width="16" height="10" viewBox="0 0 18 12">
            <polyline points="1,10 9,2 17,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    );
}

export function ChevronDown() {
    return (
        <svg width="16" height="10" viewBox="0 0 18 12">
            <polyline points="1,2 9,10 17,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    );
}

export function CloseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    );
}
