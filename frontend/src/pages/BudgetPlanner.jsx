import { useState } from "react";

export default function BudgetPlanner({ setPage, setAutoMessage }) {
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [interest, setInterest] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = () => {
    if (!budget || !days || !interest) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setPlan({
        budget,
        days,
        interest,
        recommendation: `${interest} trip in Sri Lanka`,
        suggestion:
          "Explore packages, hotels, and transport options for best experience.",
      });
      setLoading(false);
    }, 800); // fake AI delay
  };

  const askAI = () => {
    setAutoMessage(
      `Plan a ${interest} trip in Sri Lanka for ${days} days with budget LKR ${budget}. Give detailed itinerary.`
    );
    setPage("chat");
  };

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💰 Budget Planner</h1>
          <p style={styles.subtitle}>
            Plan a trip based on budget, days, and interest.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("chat")}>
          Back to Chat
        </button>
      </div>

      {/* FORM */}
      <div style={styles.card}>
        <label style={styles.label}>Travel Budget</label>
        <input
          style={styles.input}
          placeholder="Enter budget in LKR"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <label style={styles.label}>Number of Days</label>
        <input
          style={styles.input}
          placeholder="Example: 3"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <label style={styles.label}>Travel Interest</label>
        <select
          style={styles.input}
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          <option value="">Select interest</option>
          <option value="Beach 🏖️">Beach 🏖️</option>
          <option value="Adventure 🧗">Adventure 🧗</option>
          <option value="Culture 🏯">Culture 🏯</option>
          <option value="Nature 🌿">Nature 🌿</option>
          <option value="Wildlife 🐘">Wildlife 🐘</option>
        </select>

        <button style={styles.btn} onClick={generatePlan}>
          {loading ? "Generating..." : "Generate Smart Plan"}
        </button>

        {/* RESULT */}
        {plan && (
          <div style={styles.resultCard}>
            <h3 style={styles.resultTitle}>✅ Smart Plan</h3>

            <p><b>Budget:</b> LKR {plan.budget}</p>
            <p><b>Days:</b> {plan.days}</p>
            <p><b>Interest:</b> {plan.interest}</p>

            <p style={{ marginTop: "10px" }}>
              <b>Recommendation:</b> {plan.recommendation}
            </p>

            <p style={styles.suggestion}>{plan.suggestion}</p>

            <button style={styles.aiBtn} onClick={askAI}>
              Ask AI for Full Plan
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
    fontSize: "32px",
    fontWeight: "900",
    color: "#020617",
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
    marginTop: "6px",
    background: "#ffffff",
    color: "#020617",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    marginTop: "6px",
    background: "#ffffff",
    color: "#020617",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  btn: {
    width: "100%",
    padding: "14px",
    marginTop: "22px",
    border: "none",
    borderRadius: "14px",
    background: "#16a34a",
    color: "#ffffff",
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
    margin: "0 0 10px",
    fontWeight: "900",
    color: "#020617",
  },

  suggestion: {
    marginTop: "8px",
    color: "#334155",
    fontWeight: "600",
  },

  aiBtn: {
    marginTop: "12px",
    padding: "12px",
    width: "100%",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
};