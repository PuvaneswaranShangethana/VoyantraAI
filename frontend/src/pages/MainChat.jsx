import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MainChat({
  setPage,
  autoMessage,
  setAutoMessage,
  loggedUser,
}) {
  const [message, setMessage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome to VoyantraAI 🌍 How can I help your travel today?",
    },
  ]);

  const lastAutoMessageRef = useRef("");
  const recognitionRef = useRef(null);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth < 1024;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!autoMessage) return;
    if (lastAutoMessageRef.current === autoMessage) return;

    lastAutoMessageRef.current = autoMessage;
    sendMessage(autoMessage);
    setAutoMessage("");
  }, [autoMessage]);

  const stopVoice = () => {
    window.speechSynthesis.cancel();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const logout = () => {
    stopVoice();
    setPage("login");
  };

  const sendMessage = async (customMessage = null) => {
    const finalMessage = customMessage || message;

    if (!finalMessage.trim()) return;
    if (loading) return;
    if (finalMessage === "Listening...") return;

    setLoading(true);
    setError("");

    setChat((prev) => [
      ...prev,
      { sender: "user", text: finalMessage },
      { sender: "bot", text: "⏳ Thinking..." },
    ]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: finalMessage,
        user_id: loggedUser?.user_id || 1,
      });

      setChat((prev) => prev.slice(0, -1));

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.response || "Sorry, I could not generate a response.",
        },
      ]);

      setMessage("");
    } catch (err) {
      setChat((prev) => prev.slice(0, -1));

      setError("⚠️ Server connection failed. Please check backend and try again.");

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Server error. Please check if FastAPI backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    stopVoice();
    setError("");
    setMessage("");

    setChat([
      {
        sender: "bot",
        text: "Chat cleared ✅ Ask me anything about travel and tourism.",
      },
    ]);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is only supported in Google Chrome.");
      return;
    }

    if (loading) return;

    stopVoice();
    setError("");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMessage("Listening...");
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript.trim();

      if (voiceText) {
        setMessage(voiceText);

        setTimeout(() => {
          sendMessage(voiceText);
        }, 400);
      }
    };

    recognition.onerror = (event) => {
      console.log("Voice error:", event.error);

      if (event.error === "not-allowed") {
        setError("🎤 Microphone permission blocked. Please allow microphone access.");
      } else if (event.error === "no-speech") {
        setError("🎤 No speech detected. Please speak clearly and try again.");
      } else if (event.error === "audio-capture") {
        setError("🎤 No microphone found. Please check your device.");
      } else {
        setError("🎤 Voice input error. Please try again.");
      }

      setMessage("");
    };

    recognition.onend = () => {
      setMessage((current) => (current === "Listening..." ? "" : current));
    };

    try {
      recognition.start();
    } catch {
      setError("🎤 Voice input already started. Please try again.");
    }
  };

  const speakLastBotMessage = () => {
    const lastBot = [...chat].reverse().find((c) => c.sender === "bot");

    if (!lastBot || lastBot.text === "⏳ Thinking...") return;

    stopVoice();

    const cleanText = lastBot.text
      .replace(/[#*_`>-]/g, "")
      .replace(/\n+/g, ". ");

    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.lang = "en-US";
    speech.rate = 0.7;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  return (
    <div
      style={{
        ...styles.page,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <aside
        style={{
          ...styles.sidebar,
          width: isMobile ? "100%" : "260px",
          minWidth: isMobile ? "100%" : "260px",
          height: isMobile ? "auto" : "100vh",
          flexDirection: isMobile ? "row" : "column",
          overflowX: isMobile ? "auto" : "hidden",
        }}
      >
        <div style={styles.brandBox}>
          <div style={styles.logo}>🌍</div>

          {!isMobile && (
            <>
              <h2 style={styles.brandTitle}>VoyantraAI</h2>
              <p style={styles.brandText}>Smart Travel Assistant ✈️</p>
            </>
          )}
        </div>

        <button style={styles.activeMenu}>💬 Main Chat</button>

        <button style={styles.menuBtn} onClick={() => setPage("packages")}>
          📦 Packages
        </button>

        <button style={styles.menuBtn} onClick={() => setPage("hotels")}>
          🏨 Hotels
        </button>

        <button style={styles.menuBtn} onClick={() => setPage("transport")}>
          🚌 Transport
        </button>

        <button style={styles.menuBtn} onClick={() => setPage("budget")}>
          💰 Budget
        </button>

        <button style={styles.menuBtn} onClick={() => setPage("itinerary")}>
          🗓️ Itinerary
        </button>

        <button style={styles.menuBtn} onClick={() => setPage("history")}>
          📜 History
        </button>

        {!isMobile && (
          <div style={styles.travelOnly}>
            <b>Travel Only</b>
            <p>VoyantraAI answers tourism-related questions only.</p>
          </div>
        )}
      </aside>

      <main style={styles.main}>
        <header
          style={{
            ...styles.header,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
          }}
        >
          <div>
            <h1
              style={{
                ...styles.headerTitle,
                fontSize: isMobile ? "22px" : "28px",
              }}
            >
              Welcome Traveler 👋
            </h1>

            <p style={styles.headerText}>
              Plan trips, find packages, hotels, transport, and safety tips.
            </p>
          </div>

          <div
            style={{
              ...styles.profileCard,
              width: isMobile ? "100%" : "auto",
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
            onClick={() => setPage("profile")}
          >
            <span style={styles.profileIcon}>👤</span>

            <div>
              <b style={styles.profileName}>
                {loggedUser?.full_name || "Traveler"}
              </b>
              <p style={styles.onlineText}>● Online</p>
            </div>

            <button
              style={styles.profileBtn}
              onClick={(e) => {
                e.stopPropagation();
                setPage("profile");
              }}
            >
              Settings
            </button>

            <button
              style={styles.logoutBtn}
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {error && <div style={styles.errorBox}>{error}</div>}

        <section
          style={{
            ...styles.body,
            flexDirection: isTablet ? "column" : "row",
          }}
        >
          <div style={styles.chatCard}>
            <div style={styles.chatHeader}>
              <h3 style={styles.chatTitle}>💬 VoyantraAI Chat</h3>
              <span style={styles.chatStatus}>
                {loading ? "AI Thinking..." : "AI Travel Support"}
              </span>
            </div>

            <div style={styles.chatBox}>
              {chat.map((c, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.messageRow,
                    justifyContent:
                      c.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      maxWidth: isMobile ? "92%" : "72%",
                      background:
                        c.sender === "user" ? "#2563eb" : "#f8fafc",
                      color: c.sender === "user" ? "#ffffff" : "#111827",
                      border:
                        c.sender === "user" ? "none" : "1px solid #e2e8f0",
                      borderBottomRightRadius:
                        c.sender === "user" ? "4px" : "18px",
                      borderBottomLeftRadius:
                        c.sender === "bot" ? "4px" : "18px",
                    }}
                  >
                    <div style={styles.markdown}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {c.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside
            style={{
              ...styles.rightPanel,
              display: isMobile ? "none" : "block",
              width: isTablet ? "100%" : "280px",
              minWidth: isTablet ? "100%" : "280px",
            }}
          >
            <h3 style={styles.panelTitle}>⚡ Quick Suggestions</h3>

            <div
              style={{
                display: isTablet ? "grid" : "block",
                gridTemplateColumns: isTablet
                  ? "repeat(auto-fit, minmax(150px, 1fr))"
                  : "none",
                gap: isTablet ? "10px" : "0",
              }}
            >
              {[
                "best place",
                "beach",
                "adventure",
                "cheap travel",
                "family trip",
                "transport",
                "trip plan",
              ].map((item) => (
                <button
                  key={item}
                  style={{
                    ...styles.quickBtn,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  disabled={loading}
                  onClick={() => sendMessage(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>
        </section>

        <footer
          style={{
            ...styles.inputBar,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <button
            style={styles.circleBtn}
            onClick={startVoiceInput}
            disabled={loading}
          >
            🎤
          </button>

          <input
            style={{
              ...styles.input,
              flex: isMobile ? "1 1 100%" : 1,
              order: isMobile ? -1 : 0,
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) sendMessage();
            }}
            placeholder="Type your travel question here..."
            disabled={loading}
          />

          <button
            style={{
              ...styles.sendBtn,
              flex: isMobile ? 1 : "none",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
            onClick={() => {
              if (message.trim()) sendMessage();
            }}
          >
            {loading ? "Sending..." : "Send 🚀"}
          </button>

          <button style={styles.circleBtn} onClick={speakLastBotMessage}>
            🔊
          </button>

          <button style={styles.stopBtn} onClick={stopVoice}>
            ⏹ Stop
          </button>

          <button style={styles.clearBtn} onClick={clearChat}>
            Clear
          </button>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#eef6ff",
    fontFamily: "Segoe UI, Arial, sans-serif",
    color: "#111827",
  },

  sidebar: {
    background: "linear-gradient(180deg,#0f172a,#1d4ed8)",
    color: "white",
    padding: "18px",
    display: "flex",
    gap: "12px",
  },

  brandBox: {
    textAlign: "center",
    flexShrink: 0,
  },

  logo: {
    fontSize: "44px",
  },

  brandTitle: {
    margin: "8px 0 4px",
    color: "#ffffff",
    fontSize: "27px",
  },

  brandText: {
    color: "#dbeafe",
    margin: 0,
    fontSize: "14px",
  },

  activeMenu: {
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "#ffffff",
    color: "#1d4ed8",
    fontWeight: "700",
    textAlign: "left",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  menuBtn: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "#ffffff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  travelOnly: {
    marginTop: "auto",
    background: "rgba(255,255,255,0.14)",
    padding: "15px",
    borderRadius: "16px",
    fontSize: "14px",
    color: "#f8fafc",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },

  header: {
    padding: "18px 26px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
    flexShrink: 0,
  },

  headerTitle: {
    margin: 0,
    color: "#0f172a",
    fontWeight: "900",
  },

  headerText: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: "15px",
    fontWeight: "500",
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f1f5f9",
    padding: "10px 14px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
  },

  profileIcon: {
    fontSize: "25px",
  },

  profileName: {
    color: "#0f172a",
  },

  onlineText: {
    margin: 0,
    color: "#16a34a",
    fontSize: "13px",
    fontWeight: "700",
  },

  profileBtn: {
    marginLeft: "10px",
    padding: "9px 13px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "9px 13px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  errorBox: {
    margin: "14px 18px 0",
    padding: "12px 16px",
    borderRadius: "16px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: "800",
    border: "1px solid #fecaca",
  },

  body: {
    flex: 1,
    display: "flex",
    gap: "20px",
    padding: "18px",
    overflow: "hidden",
  },

  chatCard: {
    flex: 1,
    background: "#ffffff",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 15px 35px rgba(15,23,42,0.10)",
    overflow: "hidden",
    minHeight: 0,
  },

  chatHeader: {
    padding: "17px 22px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    flexShrink: 0,
  },

  chatTitle: {
    margin: 0,
    color: "#0f172a",
    fontWeight: "900",
  },

  chatStatus: {
    color: "#2563eb",
    fontWeight: "800",
    fontSize: "14px",
  },

  chatBox: {
    flex: 1,
    padding: "22px",
    overflowY: "auto",
    background: "#ffffff",
    minHeight: 0,
  },

  messageRow: {
    display: "flex",
    marginBottom: "15px",
  },

  bubble: {
    padding: "14px 18px",
    borderRadius: "18px",
    lineHeight: "1.55",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
    fontWeight: "500",
    whiteSpace: "pre-wrap",
  },

  rightPanel: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 15px 35px rgba(15,23,42,0.10)",
    overflowY: "auto",
  },

  panelTitle: {
    color: "#0f172a",
    marginTop: 0,
    fontWeight: "900",
  },

  quickBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "1px solid #bfdbfe",
    borderRadius: "14px",
    background: "#eff6ff",
    color: "#1e3a8a",
    textAlign: "left",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "14px",
  },

  inputBar: {
    display: "flex",
    gap: "12px",
    padding: "14px 18px",
    background: "#ffffff",
    boxShadow: "0 -4px 16px rgba(15,23,42,0.08)",
    flexShrink: 0,
  },

  input: {
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    background: "#ffffff",
  },

  sendBtn: {
    padding: "0 22px",
    border: "none",
    borderRadius: "16px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },

  circleBtn: {
    width: "48px",
    minWidth: "48px",
    height: "48px",
    border: "none",
    borderRadius: "16px",
    background: "#e0f2fe",
    color: "#0f172a",
    cursor: "pointer",
    fontSize: "18px",
  },

  stopBtn: {
    padding: "0 18px",
    border: "none",
    borderRadius: "16px",
    background: "#f59e0b",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearBtn: {
    padding: "0 18px",
    border: "none",
    borderRadius: "16px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: "800",
    cursor: "pointer",
  },

  markdown: {
    lineHeight: "1.7",
  },
};