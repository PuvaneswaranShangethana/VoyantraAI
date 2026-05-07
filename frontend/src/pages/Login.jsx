import { useEffect, useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login({ setPage, setLoggedUser }) {
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

  const loginUser = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      if (res.data.role === "admin") {
        setLoggedUser(res.data.user);
        setPage("admin");
      } else if (res.data.role === "user") {
        setLoggedUser(res.data.user);
        setPage("chat");
      } else {
        alert("Invalid email or password");
      }
    } catch {
      alert("Backend error");
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setLoggedUser({
        full_name: user.displayName,
        email: user.email,
        login_type: "Google",
        created_date: new Date().toLocaleString(),
      });

      setPage("chat");
    } catch (error) {
      alert("Google login failed");
      console.log(error);
    }
  };

  const guestLogin = () => {
    setLoggedUser({
      full_name: "Guest Traveler",
      email: "guest@voyantra.ai",
      login_type: "Guest",
      created_date: new Date().toLocaleString(),
    });

    setPage("chat");
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
        <div style={{ ...styles.leftPanel, textAlign: isTablet ? "center" : "left" }}>
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
            Your emotionally intelligent travel and tourism virtual assistant.
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

        <h1 style={styles.title}>Welcome Back</h1>

        <p style={styles.subtitle}>
          Login to continue your smart travel journey ✈️
        </p>

        <input
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.loginBtn} onClick={loginUser}>
          Login
        </button>

        <button style={styles.googleBtn} onClick={googleLogin}>
          🔐 Continue with Google
        </button>

        <button style={styles.guestBtn} onClick={guestLogin}>
          Continue as Guest - 1 Day
        </button>

        <p style={styles.text}>
          Don’t have an account?{" "}
          <span style={styles.link} onClick={() => setPage("register")}>
            Register
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

  loginBtn: {
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

  googleBtn: {
    width: "100%",
    padding: "15px",
    marginTop: "12px",
    border: "1px solid #fecaca",
    borderRadius: "15px",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },

  guestBtn: {
    width: "100%",
    padding: "15px",
    marginTop: "12px",
    border: "none",
    borderRadius: "15px",
    background: "#16a34a",
    color: "#ffffff",
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