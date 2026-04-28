import styles from "/src/components/Buttons.module.css";

export default function Buttons({ activePanel, onSetPanel, selectedCount }) {

  function handleSelectedPress() {
    if (activePanel === "selected") {
      onSetPanel("filter", 50);
    } else {
      onSetPanel("selected", 85);
    }
  }

  function handleQVPress() {
    if (activePanel === "qv") {
      onSetPanel("filter", 50);
    } else {
      onSetPanel("qv", 85);
    }
  }

  return (
    <div className={styles['btn-cont']}>

      {/* Selected Contacts Button */}
      <div
        className={styles.btn}
        onClick={handleSelectedPress}
        style={{
          background: activePanel === "selected" ? "#cd7259" : "var(--orange)",
          border: `2px solid ${activePanel === "selected" ? "white" : "transparent"}`,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        {/* Badge */}
        {selectedCount > 0 && (
          <div className={styles['btn-badge']}>
            {selectedCount}
          </div>
        )}
      </div>

      {/* Quick View Button */}
      <div
        className={styles.btn}
        onClick={handleQVPress}
        style={{
          background: activePanel === "qv" ? "#7f7f7f" : "#3a3a3a",
          border: `2px solid ${activePanel === "qv" ? "white" : "transparent"}`,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
          <line x1="18" y1="11" x2="22" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18" y1="15" x2="22" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

    </div>
  );
}