import { useEffect, useState } from "react";
import axios from "axios";

export default function History({ setPage }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/history")
      .then((res) => setHistory(res.data))
      .catch(() => alert("Failed to load history"));
  }, []);

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📜 Chat History</h1>
          <p style={styles.subtitle}>
            View previous traveler and chatbot conversations.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("chat")}>
          Back to Chat
        </button>
      </div>

      {/* CHAT LIST */}
      <div style={styles.chatContainer}>
        {history.length === 0 ? (
          <div style={styles.emptyCard}>No chat history available yet.</div>
        ) : (
          history.map((h) => (
            <div key={h.chat_id} style={styles.chatBlock}>
              
              {/* USER MESSAGE */}
              <div style={styles.userRow}>
                <div style={styles.userBubble}>
                  {h.user_message}
                </div>
              </div>

              {/* BOT MESSAGE */}
              <div style={styles.botRow}>
                <div style={styles.botBubble}>
                  {h.bot_response}
                </div>
              </div>

              {/* FOOTER */}
              <div style={styles.footer}>
                <span style={styles.emotion}>
                  😊 {h.emotion_detected || "Neutral"}
                </span>

                <span style={styles.time}>
                  {new Date(h.created_at).toLocaleString()}
                </span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#e0f2fe,#eff6ff)",
    fontFamily: "Segoe UI, Arial",
    padding: "26px",
    color: "#020617",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    color: "#020617",
  },

  subtitle: {
    color: "#334155",
    marginTop: "6px",
    fontWeight: "600",
  },

  backBtn: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  chatContainer: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  chatBlock: {
    background: "#ffffff",
    padding: "18px",
    borderRadius: "22px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  /* USER */
  userRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  userBubble: {
    background: "#2563eb",
    color: "white",
    padding: "12px 16px",
    borderRadius: "16px 16px 0 16px",
    maxWidth: "70%",
    fontWeight: "600",
  },

  /* BOT */
  botRow: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "10px",
  },

  botBubble: {
    background: "#e2e8f0",
    color: "#020617",
    padding: "12px 16px",
    borderRadius: "16px 16px 16px 0",
    maxWidth: "70%",
    fontWeight: "600",
  },

  /* FOOTER */
  footer: {
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#64748b",
  },

  emotion: {
    background: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: "600",
  },

  time: {
    fontSize: "12px",
  },

  emptyCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center",
    color: "#475569",
  },
};