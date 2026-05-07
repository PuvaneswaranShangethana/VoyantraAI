import { useEffect, useState } from "react";
import axios from "axios";

export default function Register({ setPage }) {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth < 1024;

  useEffect(() => {
    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const registerUser = async () => {
    if (!full_name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/register", {
        full_name,
        email,
        password,
      });

      alert(res.data.message);
      setPage("login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        flexDirection: isTablet ? "column" : "row",
        padding: isMobile ? "18px" : "30px",
      }}
    >
      {!isMobile && (
        <div
          style={{
            ...styles.leftPanel,
            textAlign: isTablet ? "center" : "left",
          }}
        >
          <img
            src="/voyantra-logo.png"
            alt="VoyantraAI Logo"
            style={{
              ...styles.bigLogo,
              width: isTablet ? "210px" : "280px",
            }}
          />

          <h1 style={styles.leftTitle}>VoyantraAI</h1>
          <p style={styles.leftText}>
            Create your smart travel profile and start planning Sri Lanka trips
            with AI support.
          </p>
        </div>
      )}

      <div
        style={{
          ...styles.card,
          width: isMobile ? "100%" : "420px",
          padding: isMobile ? "24px" : "34px",
        }}
      >
        <img
          src="/voyantra-logo.png"
          alt="VoyantraAI Logo"
          style={styles.logoImg}
        />

        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Start your journey with VoyantraAI 🌍
        </p>

        <input
          style={styles.input}
          placeholder="Full name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.registerBtn} onClick={registerUser}>
          Register
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => setPage("login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef6ff,#dbeafe)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "45px",
    fontFamily: "Segoe UI, Arial, sans-serif",
    boxSizing: "border-box",
  },

  leftPanel: {
    width: "430px",
    color: "#0f172a",
  },

  bigLogo: {
    background: "#ffffff",
    borderRadius: "30px",
    padding: "20px",
    boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
  },

  leftTitle: {
    fontSize: "42px",
    margin: "25px 0 10px",
    color: "#020617",
    fontWeight: "900",
  },

  leftText: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#334155",
    fontWeight: "600",
  },

  card: {
    background: "#ffffff",
    borderRadius: "28px",
    textAlign: "center",
    boxShadow: "0 20px 55px rgba(15,23,42,0.18)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },

  logoImg: {
    width: "120px",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#020617",
    fontWeight: "900",
  },

  subtitle: {
    color: "#334155",
    marginBottom: "24px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "15px",
    marginTop: "13px",
    borderRadius: "15px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
  },

  registerBtn: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    border: "none",
    borderRadius: "15px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  text: {
    marginTop: "20px",
    color: "#334155",
    fontWeight: "600",
  },

  link: {
    color: "#2563eb",
    fontWeight: "900",
    cursor: "pointer",
  },
};