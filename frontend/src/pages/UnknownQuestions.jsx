import { useEffect, useState } from "react";
import axios from "axios";

export default function UnknownQuestions({ setPage }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const loadQuestions = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/unknown");
      setQuestions(res.data);
    } catch {
      alert("Failed to load unknown questions");
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const saveAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) {
      alert("Select a question and enter an answer");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/unknown/add-answer", {
        question: selectedQuestion.question,
        answer,
      });

      setMessage("✅ Answer added to FAQ successfully");
      setSelectedQuestion(null);
      setAnswer("");
      loadQuestions();
    } catch {
      alert("Failed to add answer");
    }
  };

  const removeQuestion = async (id) => {
    if (!id) return alert("Question ID not found");
    if (!window.confirm("Remove this question?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/unknown/${id}`);
      setMessage("🗑️ Question removed successfully");
      loadQuestions();
    } catch {
      alert("Failed to remove question");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🧠 Unknown Questions</h1>
          <p style={styles.subtitle}>
            Review unanswered questions and add answers to improve chatbot knowledge.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("admin")}>
          Back to Admin
        </button>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.container}>
        <div style={styles.listBox}>
          <h2 style={styles.sectionTitle}>Pending Questions</h2>

          {questions.length === 0 ? (
            <div style={styles.empty}>No unknown questions found.</div>
          ) : (
            questions.map((q) => {
              const id = q.unknown_id || q.question_id || q.id;
              const question = q.question || q.user_question;

              return (
                <div
                  key={id}
                  style={{
                    ...styles.card,
                    border:
                      selectedQuestion?.id === id
                        ? "2px solid #2563eb"
                        : "1px solid #e2e8f0",
                  }}
                >
                  <div style={styles.cardTop}>
                    <span style={styles.icon}>❓</span>

                    <div style={{ flex: 1 }}>
                      <h3 style={styles.question}>{question}</h3>

                      <div style={styles.meta}>
                        <span style={styles.date}>
                          📅 {q.created_at || q.asked_date || "No date"}
                        </span>

                        <span style={styles.status}>
                          {q.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      style={styles.answerBtn}
                      onClick={() =>
                        setSelectedQuestion({
                          id,
                          question,
                        })
                      }
                    >
                      ✏️ Add Answer
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => removeQuestion(id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={styles.answerBox}>
          <h2 style={styles.sectionTitle}>Add Knowledge</h2>

          {selectedQuestion ? (
            <>
              <div style={styles.selectedBox}>
                <b>Selected Question:</b>
                <p>{selectedQuestion.question}</p>
              </div>

              <textarea
                style={styles.textarea}
                placeholder="Type the correct answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <div style={styles.actions}>
                <button style={styles.saveBtn} onClick={saveAnswer}>
                  Save to FAQ
                </button>

                <button
                  style={styles.clearBtn}
                  onClick={() => {
                    setSelectedQuestion(null);
                    setAnswer("");
                  }}
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <p style={styles.infoText}>
              Select an unknown question from the left side, then add a proper
              travel-related answer. The answer will be saved into FAQs.
            </p>
          )}
        </div>
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
    boxSizing: "border-box",
  },

  header: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    gap: "15px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    color: "#020617",
  },

  subtitle: {
    color: "#334155",
    fontWeight: "600",
    marginTop: "6px",
  },

  backBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  message: {
    marginTop: "18px",
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: "800",
  },

  container: {
    marginTop: "22px",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "22px",
  },

  listBox: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  answerBox: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    height: "fit-content",
  },

  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
    fontWeight: "900",
    color: "#020617",
  },

  card: {
    background: "#ffffff",
    padding: "18px",
    borderRadius: "18px",
    boxShadow: "0 5px 16px rgba(15,23,42,0.06)",
    marginBottom: "14px",
  },

  cardTop: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },

  icon: {
    fontSize: "26px",
  },

  question: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "900",
    color: "#020617",
  },

  meta: {
    marginTop: "8px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  date: {
    fontSize: "13px",
    color: "#475569",
    fontWeight: "600",
  },

  status: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
  },

  actions: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  answerBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  saveBtn: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearBtn: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#64748b",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  selectedBox: {
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    marginBottom: "12px",
  },

  textarea: {
    width: "100%",
    minHeight: "160px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    color: "#020617",
  },

  infoText: {
    color: "#475569",
    lineHeight: "1.7",
    fontWeight: "600",
  },

  empty: {
    background: "#f8fafc",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    color: "#475569",
    fontWeight: "600",
  },
};