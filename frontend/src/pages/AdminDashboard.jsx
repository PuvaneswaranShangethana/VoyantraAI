import { useEffect, useState } from "react";

export default function AdminDashboard({ setPage, loggedUser }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth < 1024;

  useEffect(() => {
    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const logout = () => {
    window.speechSynthesis.cancel();
    setPage("login");
  };

  const cards = [
    {
      icon: "📦",
      title: "Packages",
      value: "10+",
      text: "Add, edit, delete packages",
      page: "admin-packages",
    },
    {
      icon: "🏨",
      title: "Hotels",
      value: "10+",
      text: "Manage hotel records",
      page: "admin-hotels",
    },
    {
      icon: "🚌",
      title: "Transport",
      value: "10+",
      text: "Manage transport data",
      page: "admin-transport",
    },
    {
      icon: "❓",
      title: "FAQs",
      value: "10+",
      text: "Manage chatbot answers",
      page: "admin-faqs",
    },
    {
      icon: "🧠",
      title: "Unknown",
      value: "Pending",
      text: "Learning questions",
      page: "unknown",
    },
  ];

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
          width: isMobile ? "100%" : "285px",
          height: isMobile ? "auto" : "100vh",
          flexDirection: isMobile ? "row" : "column",
          overflowX: isMobile ? "auto" : "hidden",
        }}
      >
        <div style={styles.brand}>
          <div style={styles.logoIcon}>🌍</div>

          {!isMobile && (
            <>
              <h2 style={styles.logo}>VoyantraAI</h2>
              <p style={styles.subLogo}>Admin Control Panel</p>
            </>
          )}
        </div>

        <button style={styles.activeBtn}>📊 Dashboard</button>

        <button style={styles.sideBtn} onClick={() => setPage("admin-packages")}>
          📦 Packages
        </button>

        <button style={styles.sideBtn} onClick={() => setPage("admin-hotels")}>
          🏨 Hotels
        </button>

        <button style={styles.sideBtn} onClick={() => setPage("admin-transport")}>
          🚌 Transport
        </button>

        <button style={styles.sideBtn} onClick={() => setPage("admin-faqs")}>
          ❓ FAQs
        </button>

        <button style={styles.sideBtn} onClick={() => setPage("unknown")}>
          🧠 Unknown
        </button>

        {!isMobile && (
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        )}
      </aside>

      <main style={styles.main}>
        <header
          style={{
            ...styles.header,
            flexDirection: isTablet ? "column" : "row",
            alignItems: isTablet ? "flex-start" : "center",
          }}
        >
          <div>
            <h1
              style={{
                ...styles.title,
                fontSize: isMobile ? "26px" : "34px",
              }}
            >
              Admin Dashboard 🛠️
            </h1>

            <p style={styles.subtitle}>
              Manage VoyantraAI travel knowledge, chatbot learning, and system data.
            </p>
          </div>

          <div
            style={{
              ...styles.adminBox,
              width: isTablet ? "100%" : "auto",
            }}
          >
            <div style={styles.adminBadge}>👤 Admin Online</div>

            <div style={styles.adminName}>
              {loggedUser?.full_name || "Administrator"}
            </div>

            {isMobile && (
              <button style={styles.mobileLogoutBtn} onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </header>

        <section style={styles.stats}>
          {cards.map((card) => (
            <button
              key={card.title}
              style={styles.statCard}
              onClick={() => setPage(card.page)}
            >
              <div style={styles.statTop}>
                <span style={styles.statIcon}>{card.icon}</span>
                <h3 style={styles.cardTitle}>{card.title}</h3>
              </div>

              <h2
                style={{
                  ...styles.statNumber,
                  color: card.value === "Pending" ? "#dc2626" : "#1e293b",
                }}
              >
                {card.value}
              </h2>

              <p style={styles.cardText}>{card.text}</p>
            </button>
          ))}
        </section>

        <section style={styles.actions}>
          <div style={styles.actionCard}>
            <h2 style={styles.actionTitle}>🧠 Learning System</h2>
            <p style={styles.actionText}>
              Review unanswered user questions and convert them into chatbot knowledge.
            </p>

            <button style={styles.primaryBtn} onClick={() => setPage("unknown")}>
              View Unknown Questions
            </button>
          </div>

          <div style={styles.actionCard}>
            <h2 style={styles.actionTitle}>📚 Knowledge Management</h2>
            <p style={styles.actionText}>
              Manage packages, hotels, transport records, and chatbot FAQs separately.
            </p>

            <button style={styles.secondaryBtn} onClick={() => setPage("admin-faqs")}>
              Manage FAQs
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    background: "#edf5ff",
    fontFamily: "Segoe UI, Arial, sans-serif",
    color: "#0f172a",
    overflow: "hidden",
  },

  sidebar: {
    background: "linear-gradient(180deg,#071226,#1d4ed8)",
    color: "#ffffff",
    padding: "24px",
    display: "flex",
    gap: "12px",
    boxShadow: "8px 0 25px rgba(15,23,42,0.12)",
    boxSizing: "border-box",
  },

  brand: {
    textAlign: "center",
    flexShrink: 0,
  },

  logoIcon: {
    fontSize: "42px",
  },

  logo: {
    margin: "8px 0 4px",
    fontSize: "30px",
    fontWeight: "900",
    color: "#ffffff",
  },

  subLogo: {
    margin: 0,
    color: "#dbeafe",
    fontWeight: "700",
    fontSize: "15px",
  },

  activeBtn: {
    padding: "15px",
    borderRadius: "16px",
    background: "#ffffff",
    color: "#1d4ed8",
    fontWeight: "800",
    textAlign: "left",
    border: "none",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },

  sideBtn: {
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.14)",
    color: "#ffffff",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },

  logoutBtn: {
    marginTop: "auto",
    padding: "15px",
    borderRadius: "16px",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "900",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
  },

  main: {
    flex: 1,
    padding: "28px",
    overflowY: "auto",
    boxSizing: "border-box",
  },

  header: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "28px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
  },

  title: {
    margin: 0,
    fontWeight: "900",
    color: "#020617",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#334155",
    fontWeight: "600",
    fontSize: "16px",
  },

  adminBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  adminBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "13px 18px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  adminName: {
    background: "#eff6ff",
    color: "#1e3a8a",
    padding: "13px 18px",
    borderRadius: "999px",
    fontWeight: "900",
  },

  mobileLogoutBtn: {
    padding: "12px 16px",
    borderRadius: "14px",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "900",
    border: "none",
    cursor: "pointer",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "26px",
  },

  statCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    textAlign: "left",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statIcon: {
    fontSize: "24px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "900",
    color: "#020617",
  },

  statNumber: {
    margin: "18px 0 8px",
    fontSize: "34px",
    fontWeight: "900",
  },

  cardText: {
    margin: 0,
    color: "#334155",
    fontWeight: "600",
    fontSize: "15px",
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "22px",
    marginTop: "28px",
  },

  actionCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "28px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
  },

  actionTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "900",
    color: "#020617",
  },

  actionText: {
    color: "#1e293b",
    lineHeight: "1.6",
    marginTop: "10px",
    fontWeight: "600",
    fontSize: "16px",
  },

  primaryBtn: {
    marginTop: "14px",
    padding: "14px 20px",
    borderRadius: "16px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "900",
    border: "none",
    cursor: "pointer",
  },

  secondaryBtn: {
    marginTop: "14px",
    padding: "14px 20px",
    borderRadius: "16px",
    background: "#16a34a",
    color: "#ffffff",
    fontWeight: "900",
    border: "none",
    cursor: "pointer",
  },
};