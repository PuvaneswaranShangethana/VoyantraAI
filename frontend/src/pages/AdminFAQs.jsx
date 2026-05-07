import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminFAQs({ setPage }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("Travel");
  const [message, setMessage] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isTablet = screenWidth < 1024;
  const isMobile = screenWidth < 768;

  useEffect(() => {
    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const saveFAQ = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please fill question and answer");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/faqs", {
        question,
        answer,
        category,
      });

      const newFaq = {
        question,
        answer,
        category,
      };

      setFaqs((prev) => [newFaq, ...prev]);
      setMessage("✅ FAQ saved successfully");

      setQuestion("");
      setAnswer("");
      setCategory("Travel");
    } catch (error) {
      alert(error.response?.data?.detail || "FAQ save failed");
    }
  };

  const clearForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("Travel");
    setMessage("");
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.header,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <div>
          <h1 style={styles.title}>❓ Admin FAQs</h1>
          <p style={styles.subtitle}>
            Add chatbot questions and answers for VoyantraAI knowledge.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("admin")}>
          Back to Admin
        </button>
      </div>

      <div
        style={{
          ...styles.container,
          flexDirection: isTablet ? "column" : "row",
        }}
      >
        <div style={{ ...styles.form, width: isTablet ? "100%" : "50%" }}>
          <h2 style={styles.formTitle}>FAQ Management</h2>

          {message && <div style={styles.message}>{message}</div>}

          <input
            style={styles.input}
            placeholder="Enter Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Enter Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <select
            style={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Travel">Travel</option>
            <option value="Package">Package</option>
            <option value="Hotel">Hotel</option>
            <option value="Transport">Transport</option>
            <option value="Budget">Budget</option>
            <option value="Safety">Safety</option>
            <option value="Admin Learned">Admin Learned</option>
          </select>

          <div style={styles.btnRow}>
            <button style={styles.saveBtn} onClick={saveFAQ}>
              Save FAQ
            </button>

            <button style={styles.clearBtn} onClick={clearForm}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ ...styles.infoBox, width: isTablet ? "100%" : "50%" }}>
          <h2 style={styles.tableTitle}>FAQ Purpose</h2>
          <p style={styles.infoText}>
            FAQs help VoyantraAI answer common travel questions from the
            database before using Gemini AI. This improves speed, accuracy, and
            allows admin learning.
          </p>

          <h3 style={styles.listTitle}>Recently Added FAQs</h3>

          {faqs.length === 0 ? (
            <p style={styles.emptyText}>No FAQ added in this session yet.</p>
          ) : (
            <div style={styles.faqList}>
              {faqs.map((f, index) => (
                <div key={index} style={styles.faqCard}>
                  <b>Q: {f.question}</b>
                  <p>A: {f.answer}</p>
                  <span style={styles.badge}>{f.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "25px",
    background: "linear-gradient(135deg,#e0f2fe,#eff6ff)",
    minHeight: "100vh",
    fontFamily: "Segoe UI, Arial, sans-serif",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    background: "#ffffff",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    gap: "15px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    color: "#020617",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#334155",
    fontWeight: "600",
  },

  backBtn: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  container: {
    display: "flex",
    gap: "22px",
    marginTop: "22px",
  },

  form: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  formTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: "900",
    color: "#020617",
  },

  message: {
    padding: "10px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "10px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginTop: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#020617",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    marginTop: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#020617",
    minHeight: "130px",
    outline: "none",
    boxSizing: "border-box",
  },

  btnRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  saveBtn: {
    background: "#16a34a",
    color: "#ffffff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearBtn: {
    background: "#64748b",
    color: "#ffffff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  infoBox: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  tableTitle: {
    margin: "0 0 14px",
    fontSize: "22px",
    fontWeight: "900",
    color: "#020617",
  },

  infoText: {
    color: "#334155",
    lineHeight: "1.7",
    fontWeight: "600",
  },

  listTitle: {
    marginTop: "22px",
    color: "#020617",
    fontWeight: "900",
  },

  emptyText: {
    color: "#64748b",
    fontWeight: "600",
  },

  faqList: {
    display: "grid",
    gap: "12px",
  },

  faqCard: {
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },

  badge: {
    display: "inline-block",
    marginTop: "8px",
    background: "#dbeafe",
    color: "#1e3a8a",
    padding: "5px 10px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "12px",
  },
};