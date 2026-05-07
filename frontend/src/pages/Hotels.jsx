import { useEffect, useState } from "react";
import axios from "axios";

export default function Hotels({ setPage, setAutoMessage }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/hotels")
      .then((res) => setHotels(res.data))
      .catch(() => alert("Failed to load hotels"));
  }, []);

  const askAI = (h) => {
    setAutoMessage(
      `Tell me more about ${h.hotel_name}. Type ${h.hotel_type}, price per night LKR ${h.price_per_night}, rating ${h.rating}, contact ${h.contact_number}.`
    );
    setPage("chat");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏨 Hotels</h1>
          <p style={styles.subtitle}>
            Choose a hotel and ask VoyantraAI for more details.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("chat")}>
          Back to Chat
        </button>
      </div>

      <div style={styles.grid}>
        {hotels.map((h) => (
          <div style={styles.card} key={h.hotel_id}>
            <div style={styles.topRow}>
              <div style={styles.icon}>🏨</div>
              <span style={styles.badge}>{h.hotel_type}</span>
            </div>

            <h2 style={styles.cardTitle}>{h.hotel_name}</h2>

            <div style={styles.infoBox}>
              <p style={styles.text}><b>Price/Night:</b> LKR {h.price_per_night}</p>
              <p style={styles.text}><b>Rating:</b> ⭐ {h.rating}</p>
              <p style={styles.text}><b>Contact:</b> {h.contact_number}</p>
            </div>

            <button style={styles.viewBtn} onClick={() => askAI(h)}>
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
    background: "#dcfce7",
    color: "#166534",
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