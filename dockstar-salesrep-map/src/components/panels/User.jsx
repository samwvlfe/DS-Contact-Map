import styles from "./User.module.css";
import listyles from "./Contact.module.css";
import { useUser } from "../../context/UserContext";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

export default function User() {
  const { user, error } = useUser();

  async function handleLogout() {
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  }

  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className="stack gap10">
      <div className={styles.avatar}>
        {user.displayName ? user.displayName[0].toUpperCase() : "?"}
      </div>
      <div className={`${listyles.infoCont} stack`}>
        <div className={`${listyles.infoLine} stack`}>
          <div className={listyles.infoTitle}>NAME</div>
          <div className={listyles.info}>{user.displayName || "—"}</div>
        </div>
        <div className={`${listyles.infoLine} stack`}>
          <div className={listyles.infoTitle}>EMAIL</div>
          <div className={listyles.info}>{user.email || "—"}</div>
        </div>
        <div className={`${listyles.infoLine} stack`}>
          <div className={listyles.infoTitle}>HUB ID</div>
          <div className={listyles.info}>{user.hubId || "—"}</div>
        </div>
      </div>
      <div className={`${styles.logout} _btn`} onClick={handleLogout}>
        Log Out
      </div>
    </div>
  );
}
