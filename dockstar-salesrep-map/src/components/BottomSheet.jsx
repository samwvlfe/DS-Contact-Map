import { useRef, useEffect } from "react";
import styles from "./BottomSheet.module.css";
import NavArrow from "./NavArrow.jsx";
import { CloseIcon } from "./icons";

const SNAP_POINTS = [8, 50,90];
const SNAP_THRESHOLD = 70;

export default function BottomSheet({ snapVh, setSnapVh, title, children, onBack }) {
    const sheetRef = useRef(null);
    const dragRef  = useRef({ active: false, startY: 0, startH: 0 });

    const vh = v => window.innerHeight * v / 100;

    function nearestSnap(px, delta) {
    const biased = px + (delta > 0 ? SNAP_THRESHOLD : -SNAP_THRESHOLD);
    return SNAP_POINTS.reduce((best, v) =>
        Math.abs(vh(v) - biased) < Math.abs(vh(best) - biased) ? v : best
    );
    }

    function applySnap(v) {
    setSnapVh(v);
    if (sheetRef.current) {
        sheetRef.current.style.transition = "";
        sheetRef.current.style.height = "";
    }
    }

    function startDrag(y) {
    if (!sheetRef.current) return;
        dragRef.current = { active: true, startY: y, startH: sheetRef.current.offsetHeight };
        sheetRef.current.style.transition = "none";
    }

    function moveDrag(y) {
        if (!dragRef.current.active || !sheetRef.current) return;
        const delta = dragRef.current.startY - y;
        const next = Math.min(Math.max(dragRef.current.startH + delta, vh(8)), vh(90));
        sheetRef.current.style.height = next + "px";
    }

    function endDrag(y) {
        if (!dragRef.current.active) return;
        dragRef.current.active = false;
        const delta = dragRef.current.startY - y;
        if (Math.abs(delta) < 8) {
            if (sheetRef.current) sheetRef.current.style.transition = "";
            return;
        }
        const snap = nearestSnap(sheetRef.current.offsetHeight, delta);
        applySnap(snap);
    }

    // Global mouse listeners for desktop dragging
    useEffect(() => {
        const mm = e => moveDrag(e.clientY);
        const mu = e => endDrag(e.clientY);
        document.addEventListener("mousemove", mm);
        document.addEventListener("mouseup", mu);
        return () => {
            document.removeEventListener("mousemove", mm);
            document.removeEventListener("mouseup", mu);
        };
    }, []);

    const idx = SNAP_POINTS.indexOf(snapVh);

    return (
        <div
            className={`${styles['sheet-cont']} stack`}
            ref={sheetRef}
            style={{
                height: `${snapVh}vh`
            }}
            onTouchStart={e => { if (e.target.closest("input,button")) return; startDrag(e.touches[0].clientY); }}
            onTouchMove={e => moveDrag(e.touches[0].clientY)}
            onTouchEnd={e => endDrag(e.changedTouches[0].clientY)}
            onMouseDown={e => {
                if (e.target.closest("input,button")) return;
                startDrag(e.clientY);
            }}
        >
            <div className={`${styles.navBar} row`}>
                <div className={styles.dragPill}/>
                <div className={`${styles.sheetTitle} bold`}>
                    {title}
                </div>
                <div className={styles.navArrows}>
                    <NavArrow
                    dir="up"
                    hidden={idx >= SNAP_POINTS.length - 1}
                    onClick={() => applySnap(SNAP_POINTS[idx + 1])}
                    />
                    <NavArrow
                    dir="down"
                    hidden={idx <= 0}
                    onClick={() => applySnap(SNAP_POINTS[idx - 1])}
                    />
                    {onBack && (
                        <div className={styles.closeBtn} onClick={onBack}>
                            <CloseIcon />
                        </div>
                    )}
                </div>
            </div>

            {/* Panel content */}
            <div className={`${styles.panel} stack`}>
                {children}
            </div>
        </div>
    );
}