import { useState } from "react";

export default function ProfileSettings({ setPage, loggedUser }) {
  const [profile, setProfile] = useState({
    full_name: loggedUser?.full_name || "Traveler",
    email: loggedUser?.email || "",
    login_type: loggedUser?.login_type || "Email",
    created_date: loggedUser?.created_date || "",
    country: "Sri Lanka",
    preferredLanguage: "English",
    travelInterest: "Beach",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    alert("Profile settings saved successfully ✅");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👤 Profile Settings</h1>
          <p style={styles.subtitle}>
            View logged-in user details and manage travel preferences.
          </p>
        </div>

        <button style={styles.backBtn} onClick={() => setPage("chat")}>
          Back to Chat
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.avatarBox}>
          <div style={styles.avatar}>👤</div>
          <h2 style={styles.name}>{profile.full_name}</h2>
          <p style={styles.email}>{profile.email}</p>
          <span style={styles.badge}>● Online Traveler</span>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <b>Name</b>
            <p>{profile.full_name}</p>
          </div>

          <div style={styles.infoCard}>
            <b>Email</b>
            <p>{profile.email}</p>
          </div>

          <div style={styles.infoCard}>
            <b>Login Type</b>
            <p>{profile.login_type}</p>
          </div>

          <div style={styles.infoCard}>
            <b>Created Date</b>
            <p>{profile.created_date}</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Travel Preferences</h2>

        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>Country</label>
            <input
              style={styles.input}
              name="country"
              value={profile.country}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={styles.label}>Preferred Language</label>
            <select
              style={styles.input}
              name="preferredLanguage"
              value={profile.preferredLanguage}
              onChange={handleChange}
            >
              <option>English</option>
              <option>Tamil</option>
              <option>Sinhala</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Travel Interest</label>
            <select
              style={styles.input}
              name="travelInterest"
              value={profile.travelInterest}
              onChange={handleChange}
            >
              <option>Beach</option>
              <option>Adventure</option>
              <option>Culture</option>
              <option>Nature</option>
              <option>Wildlife</option>
              <option>Family Trip</option>
            </select>
          </div>
        </div>

        <div style={styles.btnRow}>
          <button style={styles.saveBtn} onClick={saveProfile}>
            Save Preferences
          </button>

          <button style={styles.logoutBtn} onClick={() => setPage("login")}>
            Logout
          </button>
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
    maxWidth: "950px",
    margin: "30px auto",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "26px",
    boxShadow: "0 15px 35px rgba(15,23,42,0.10)",
  },

  avatarBox: {
    textAlign: "center",
    marginBottom: "25px",
  },

  avatar: {
    width: "95px",
    height: "95px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44px",
  },

  name: {
    margin: 0,
    color: "#020617",
    fontWeight: "900",
  },

  email: {
    marginTop: "5px",
    color: "#475569",
    fontWeight: "600",
  },

  badge: {
    display: "inline-block",
    marginTop: "10px",
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "800",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },

  infoCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "18px",
    borderRadius: "18px",
  },

  sectionTitle: {
    marginTop: "30px",
    color: "#020617",
    fontWeight: "900",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#1e293b",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "15px",
    outline: "none",
  },

  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  saveBtn: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "14px",
    background: "#16a34a",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "14px",
    background: "#ef4444",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },
};