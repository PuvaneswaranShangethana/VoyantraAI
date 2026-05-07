import { useState } from "react";

export default function Itinerary({ setPage, setAutoMessage }) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [plan, setPlan] = useState(null);

  const createItinerary = () => {
    if (!destination || !days) {
      alert("Please enter destination and days");
      return;
    }

    setPlan({
      destination,
      days,
      day1: "Arrival, hotel check-in, local sightseeing.",
      day2: "Main attractions, food experience, evening relaxation.",
      day3: "Shopping, photography, and return journey.",
    });
  };

  const askAI = () => {
    setAutoMessage(
      `Create a detailed ${days}-day itinerary for ${destination} in Sri Lanka with places, hotels, transport, food, and safety tips.`
    );
    setPage("chat");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🗓️ Smart Itinerary Planner</h1>
          <p style={styles.subtitle}>
            Generate a simple day-by-day Sri Lanka travel plan.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("chat")}>
          Back to Chat
        </button>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Destination</label>
        <input
          style={styles.input}
          placeholder="Example: Ella"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <label style={styles.label}>Number of Days</label>
        <input
          style={styles.input}
          placeholder="Example: 3"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <button style={styles.btn} onClick={createItinerary}>
          Generate Itinerary
        </button>

        {plan && (
          <div style={styles.resultCard}>
            <h3 style={styles.resultTitle}>
              ✅ {plan.days}-Day Itinerary for {plan.destination}
            </h3>

            <p style={styles.day}><b>Day 1:</b> {plan.day1}</p>
            <p style={styles.day}><b>Day 2:</b> {plan.day2}</p>
            <p style={styles.day}><b>Day 3:</b> {plan.day3}</p>

            <p style={styles.tip}>
              ✅ Tip: Confirm hotel, transport, and weather before travelling.
            </p>

            <button style={styles.aiBtn} onClick={askAI}>
              Ask AI for Full Itinerary
            </button>
          </div>
        )}
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
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },
  card: {
    maxWidth: "560px",
    margin: "40px auto",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "26px",
    boxShadow: "0 15px 35px rgba(15,23,42,0.10)",
    border: "1px solid #e2e8f0",
  },
  label: {
    display: "block",
    marginTop: "14px",
    marginBottom: "6px",
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
    fontSize: "15px",
    color: "#020617",
    background: "#ffffff",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: "22px",
    border: "none",
    borderRadius: "14px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: "22px",
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    color: "#111827",
  },
  resultTitle: {
    margin: "0 0 12px",
    color: "#020617",
    fontWeight: "900",
  },
  day: {
    color: "#1e293b",
    fontWeight: "500",
    lineHeight: "1.6",
  },
  tip: {
    marginTop: "12px",
    color: "#166534",
    fontWeight: "700",
  },
  aiBtn: {
    marginTop: "12px",
    padding: "12px",
    width: "100%",
    borderRadius: "12px",
    border: "none",
    background: "#16a34a",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },
};