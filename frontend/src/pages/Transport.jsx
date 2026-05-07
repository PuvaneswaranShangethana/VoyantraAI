import { useEffect, useState } from "react";
import axios from "axios";

export default function Transport({ setPage, setAutoMessage }) {
  const [transport, setTransport] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/transport")
      .then((res) => setTransport(res.data))
      .catch(() => alert("Failed to load transport"));
  }, []);

  const askAI = (t) => {
    setAutoMessage(
      `Tell me more about ${t.transport_type} from ${t.from_location} to ${t.to_location}. Estimated time ${t.estimated_time}, cost LKR ${t.estimated_cost}, notes: ${t.notes}.`
    );
    setPage("chat");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🚌 Transport Options</h1>
          <p style={styles.subtitle}>
            Compare travel routes, estimated time, and transport cost.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("chat")}>
          Back to Chat
        </button>
      </div>

      <div style={styles.grid}>
        {transport.map((t) => (
          <div style={styles.card} key={t.transport_id}>
            <div style={styles.topRow}>
              <div style={styles.icon}>🚌</div>
              <span style={styles.badge}>{t.transport_type}</span>
            </div>

            <h2 style={styles.cardTitle}>
              {t.from_location} → {t.to_location}
            </h2>

            <div style={styles.infoBox}>
              <p style={styles.text}><b>Time:</b> {t.estimated_time}</p>
              <p style={styles.text}><b>Cost:</b> LKR {t.estimated_cost}</p>
              <p style={styles.text}><b>Notes:</b> {t.notes}</p>
            </div>

            <button style={styles.viewBtn} onClick={() => askAI(t)}>
              Ask AI about this
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#e0f2fe,#eff6ff)",
    fontFamily: "Segoe UI, Arial, sans-serif",
    padding: "26px",
    color: "#0f172a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
  },
  title: {
    margin: 0,
    color: "#020617",
    fontSize: "32px",
    fontWeight: "900",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#334155",
    fontWeight: "600",
  },
  backBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "22px",
    marginTop: "25px",
  },
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  badge: {
    background: "#dbeafe",
    color: "#1e3a8a",
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "13px",
  },
  cardTitle: {
    margin: "18px 0 14px",
    color: "#020617",
    fontSize: "22px",
    fontWeight: "900",
  },
  infoBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "12px",
  },
  text: {
    color: "#1e293b",
    lineHeight: "1.5",
    margin: "6px 0",
    fontWeight: "500",
  },
  viewBtn: {
    width: "100%",
    marginTop: "16px",
    padding: "13px",
    border: "none",
    borderRadius: "14px",
    background: "#16a34a",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
};