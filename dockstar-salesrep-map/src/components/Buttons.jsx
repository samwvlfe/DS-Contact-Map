import styles from "./Buttons.module.css";
import { useUser } from "../context/UserContext";

export default function Buttons({ activePanel, onSetPanel, selectedCount }) {
  const { user } = useUser();
  const initial = user?.firstName?.[0]?.toUpperCase() ?? null;

  function handleCreateListPress() {
    if (activePanel === "createlist") {
      onSetPanel("filter", 50);
    } else {
      onSetPanel("createlist", 85);
    }
  }

  function handleUserPress() {
    if (activePanel === "user") {
      onSetPanel("filter", 85);
    } else {
      onSetPanel("user", 85);
    }
  }

  return (
    <div className={`${styles['btn-cont']} row gap10`}>

      {/* Selected Contacts Button */}
      <div
        className={styles.btn}
        onClick={handleCreateListPress}
        style={{
          background: activePanel === "createlist" ? "#cd7259" : "var(--orange)",
          border: `2px solid ${activePanel === "createlist" ? "white" : "transparent"}`,
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

      {/* User Info Button */}
      <div
        className={styles.btn}
        onClick={handleUserPress}
        style={{
          background: activePanel === "user" ? "#888888" : "#606060",
          border: `2px solid ${activePanel === "user" ? "white" : "transparent"}`,
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {initial}
      </div>

    </div>
  );
}