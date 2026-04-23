const sheet = document.querySelector('.bottom-nav-cont');
const arrowUp   = document.querySelector('.arrow-up');
const arrowDown = document.querySelector('.arrow-down');

const SNAP_POINTS_VH = [8, 50, 85];
const SNAP_THRESHOLD = 60;

let isDragging = false;
let startY = 0;
let startHeight = 0;

function vh(v) { return window.innerHeight * (v / 100); }

function nearestSnap(px, delta) {
    const biased = px + (delta > 0 ? SNAP_THRESHOLD : -SNAP_THRESHOLD);
    return SNAP_POINTS_VH.reduce((best, v) => {
        return Math.abs(vh(v) - biased) < Math.abs(vh(best) - biased) ? v : best;
    });
}

function applySnap(snapVh) {
    sheet.dataset.snap = snapVh;
    sheet.style.height = '';
    if (snapVh === 85) {
        sheet.classList.add('open');
    } else {
        sheet.classList.remove('open');
    }
    if (snapVh === 8)  sheet.style.height = '8vh';
    if (snapVh === 50) sheet.style.height = '';

    const idx = SNAP_POINTS_VH.indexOf(snapVh);
    arrowUp.classList.toggle('hidden',   idx === SNAP_POINTS_VH.length - 1);
    arrowDown.classList.toggle('hidden', idx === 0);
}

function startDrag(y) {
    isDragging = true;
    startY = y;
    startHeight = sheet.offsetHeight;
    sheet.style.transition = 'none';
}

function moveDrag(y) {
    if (!isDragging) return;
    const delta = startY - y;
    const next = Math.min(Math.max(startHeight + delta, vh(8)), vh(85));
    sheet.style.height = next + 'px';
}

function endDrag(y) {
    if (!isDragging) return;
    isDragging = false;
    sheet.style.transition = '';

    const delta = startY - y;
    if (Math.abs(delta) < 8) return;

    const snap = nearestSnap(sheet.offsetHeight, delta);
    applySnap(snap);
}

function isDragExcluded(target) {
    return target.closest('.distance-slider') || target.closest('.location-sel-cont');
}

// Touch
sheet.addEventListener('touchstart', e => {
    if (isDragExcluded(e.target)) return;
    startDrag(e.touches[0].clientY);
}, { passive: true });
sheet.addEventListener('touchmove',  e => moveDrag(e.touches[0].clientY),  { passive: true });
sheet.addEventListener('touchend',   e => endDrag(e.changedTouches[0].clientY));

// Mouse (desktop testing)
sheet.addEventListener('mousedown', e => {
    if (isDragExcluded(e.target)) return;
    startDrag(e.clientY);
});
document.addEventListener('mousemove', e => moveDrag(e.clientY));
document.addEventListener('mouseup',   e => endDrag(e.clientY));

// Location autocomplete
const LOCATIONS = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
    'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
    'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
    'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
    'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
    'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
    'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
    'Wisconsin','Wyoming',
    'New York City','Los Angeles','Chicago','Houston','Phoenix','Philadelphia',
    'San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth',
    'Columbus','Charlotte','Indianapolis','San Francisco','Seattle','Denver','Nashville',
    'Oklahoma City','El Paso','Washington DC','Las Vegas','Louisville','Memphis',
    'Portland','Baltimore','Milwaukee','Albuquerque','Tucson','Fresno','Sacramento',
    'Mesa','Kansas City','Atlanta','Omaha','Colorado Springs','Raleigh','Miami',
    'Cleveland','Tulsa','Arlington','New Orleans','Wichita','Bakersfield','Tampa',
    'Clemson','Greenville','Spartanburg','Charleston','Columbia',
];

const locationInput    = document.querySelector('.location-sel-input');
const locationDropdown = document.querySelector('.location-dropdown');
const selectedLocos    = document.querySelector('.selected-locos');

function getSelected() {
    return [...selectedLocos.querySelectorAll('.loco')].map(el => el.dataset.value);
}

function addLoco(name) {
    if (getSelected().includes(name)) return;
    const tag = document.createElement('div');
    tag.className = 'loco';
    tag.textContent = name;
    tag.dataset.value = name;
    selectedLocos.appendChild(tag);
    updateFilterCount();
}

function showDropdown(query) {
    const q = query.trim().toLowerCase();
    if (!q) { hideDropdown(); return; }
    const selected = getSelected();
    const matches = LOCATIONS.filter(l =>
        l.toLowerCase().includes(q) && !selected.includes(l)
    ).slice(0, 6);

    if (!matches.length) { hideDropdown(); return; }

    locationDropdown.innerHTML = '';
    matches.forEach(name => {
        const opt = document.createElement('div');
        opt.className = 'dropdown-option';
        opt.textContent = name;
        opt.addEventListener('mousedown', e => {
            e.preventDefault();
            addLoco(name);
            locationInput.value = '';
            hideDropdown();
        });
        locationDropdown.appendChild(opt);
    });
    locationDropdown.classList.add('visible');
}

function hideDropdown() {
    locationDropdown.classList.remove('visible');
    locationDropdown.innerHTML = '';
}

locationInput.addEventListener('focus', () => applySnap(85));
locationInput.addEventListener('input', () => showDropdown(locationInput.value));
locationInput.addEventListener('blur', () => setTimeout(hideDropdown, 150));

// Filter count
const filterAmount = document.querySelector('.filter-amount');
const slider = document.querySelector('.distance-slider');

function updateFilterCount() {
    const selectedStatuses  = document.querySelectorAll('.lead-status.selected').length;
    const selectedLocations = document.querySelectorAll('.loco').length;
    const sliderChanged     = Number(slider.value) !== 25 ? 1 : 0;
    filterAmount.textContent = selectedStatuses + selectedLocations + sliderChanged;
}

// Lead status selection
document.querySelectorAll('.lead-status').forEach(el => {
    el.addEventListener('click', () => {
        el.classList.toggle('selected');
        updateFilterCount();
    });
});

// Distance slider
const selDistance = document.querySelector('.sel-distance');
slider.addEventListener('input', () => {
    selDistance.textContent = slider.value + ' MI';
    updateFilterCount();
});

updateFilterCount();

// Arrow buttons
arrowUp.addEventListener('click', () => {
    const idx = SNAP_POINTS_VH.indexOf(Number(sheet.dataset.snap) || 50);
    if (idx < SNAP_POINTS_VH.length - 1) applySnap(SNAP_POINTS_VH[idx + 1]);
});
arrowDown.addEventListener('click', () => {
    const idx = SNAP_POINTS_VH.indexOf(Number(sheet.dataset.snap) || 50);
    if (idx > 0) applySnap(SNAP_POINTS_VH[idx - 1]);
});

// Set initial arrow state
applySnap(50);

const navTitle  = document.querySelector('.nav-title');
const SelConBtn = document.querySelector('.selected-contacts-btn');
const QVBtn     = document.querySelector('.contact-qv-btn');

const PANELS = {
    filter:   { cls: null,          title: 'Filter Contacts',   snap: 50 },
    selected: { cls: 'alt-panel1',  title: 'Selected Contacts', snap: 50 },
    qv:       { cls: 'alt-panel2',  title: 'Contact Quick View',snap: 85 },
};

let activePanel = 'filter';

function setPanel(name) {
    const prev = PANELS[activePanel];
    const next = PANELS[name];

    if (prev.cls) sheet.classList.remove(prev.cls);
    if (next.cls) sheet.classList.add(next.cls);

    activePanel = name;
    navTitle.textContent = next.title;
    applySnap(next.snap);
}

SelConBtn.addEventListener('click', () => {
    setPanel(activePanel === 'selected' ? 'filter' : 'selected');
});

QVBtn.addEventListener('click', () => {
    setPanel(activePanel === 'qv' ? 'filter' : 'qv');
});
