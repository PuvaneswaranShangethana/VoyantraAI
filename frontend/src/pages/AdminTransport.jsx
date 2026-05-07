import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminTransport({ setPage }) {
  const [transport, setTransport] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isTablet = screenWidth < 1024;
  const isMobile = screenWidth < 768;

  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    transport_type: "",
    estimated_time: "",
    estimated_cost: "",
    notes: "",
  });

  useEffect(() => {
    loadTransport();

    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const loadTransport = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/transport");
      setTransport(res.data);
    } catch {
      alert("Failed to load transport records");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      from_location: "",
      to_location: "",
      transport_type: "",
      estimated_time: "",
      estimated_cost: "",
      notes: "",
    });
    setSelectedId(null);
    setMessage("");
  };

  const saveTransport = async () => {
  if (
    !form.from_location ||
    !form.to_location ||
    !form.transport_type ||
    !form.estimated_time ||
    !form.estimated_cost ||
    !form.notes
  ) {
    alert("Please fill all fields");
    return;
  }

  const data = {
    from_location: form.from_location,
    to_location: form.to_location,
    transport_type: form.transport_type,
    estimated_time: form.estimated_time,
    estimated_cost: Number(form.estimated_cost),
    notes: form.notes,
  };

  try {
    if (selectedId) {
      await axios.put(`http://127.0.0.1:8000/transport/${selectedId}`, data);
      setMessage("✅ Transport updated successfully");
    } else {
      await axios.post("http://127.0.0.1:8000/transport", data);
      setMessage("✅ Transport saved successfully");
    }

    await loadTransport();
    resetForm();
  } catch (error) {
    alert(error.response?.data?.detail || "Transport save/update failed");
  }
};

  const deleteTransport = async () => {
    if (!selectedId) {
      alert("Select a transport record first");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/transport/${selectedId}`);
      setMessage("🗑️ Transport deleted successfully");
      loadTransport();
      resetForm();
    } catch {
      alert("Transport delete failed");
    }
  };

  const selectTransport = (t) => {
    setSelectedId(t.transport_id);
    setForm({
      from_location: t.from_location || "",
      to_location: t.to_location || "",
      transport_type: t.transport_type || "",
      estimated_time: t.estimated_time || "",
      estimated_cost: t.estimated_cost || "",
      notes: t.notes || "",
    });
    setMessage(`✏️ Selected transport ID ${t.transport_id}`);
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
          <h1 style={styles.title}>🚌 Admin Transport</h1>
          <p style={styles.subtitle}>
            Add, edit, delete, and manage transport records.
          </p>
        </div>

        <button onClick={() => setPage("admin")} style={styles.backBtn}>
          Back to Admin
        </button>
      </div>

      <div
        style={{
          ...styles.container,
          flexDirection: isTablet ? "column" : "row",
        }}
      >
        <div style={{ ...styles.form, width: isTablet ? "100%" : "40%" }}>
          <h2 style={styles.formTitle}>
            {selectedId ? "Selected Transport" : "Transport Management"}
          </h2>

          {message && <div style={styles.message}>{message}</div>}

          <input
            name="from_location"
            value={form.from_location}
            onChange={handleChange}
            placeholder="From Location"
            style={styles.input}
          />

          <input
            name="to_location"
            value={form.to_location}
            onChange={handleChange}
            placeholder="To Location"
            style={styles.input}
          />

          <select
            name="transport_type"
            value={form.transport_type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Transport Type</option>
            <option value="Train 🚆">Train 🚆</option>
            <option value="Bus 🚌">Bus 🚌</option>
            <option value="Taxi 🚕">Taxi 🚕</option>
            <option value="Car 🚗">Car 🚗</option>
            <option value="Van 🚐">Van 🚐</option>
            <option value="Jeep 🐘">Jeep 🐘</option>
          </select>

          <input
            name="estimated_time"
            value={form.estimated_time}
            onChange={handleChange}
            placeholder="Estimated Time e.g. 3h"
            style={styles.input}
          />

          <input
            name="estimated_cost"
            value={form.estimated_cost}
            onChange={handleChange}
            placeholder="Estimated Cost in LKR"
            type="number"
            style={styles.input}
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
            style={styles.textarea}
          />

          <div style={styles.btnRow}>
            <button style={styles.saveBtn} onClick={saveTransport}>
              {selectedId ? "Update" : "Save"}
            </button>

            <button style={styles.deleteBtn} onClick={deleteTransport}>
              Delete
            </button>

            <button style={styles.clearBtn} onClick={resetForm}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ ...styles.tableBox, width: isTablet ? "100%" : "60%" }}>
          <h2 style={styles.tableTitle}>Transport List</h2>

          <div style={styles.tableScroll}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>From</th>
                  <th style={styles.th}>To</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Cost</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {transport.map((t) => (
                  <tr
                    key={t.transport_id}
                    style={{
                      background:
                        selectedId === t.transport_id ? "#dbeafe" : "#ffffff",
                    }}
                  >
                    <td style={styles.td}>{t.transport_id}</td>
                    <td style={styles.td}>{t.from_location}</td>
                    <td style={styles.td}>{t.to_location}</td>
                    <td style={styles.td}>{t.transport_type}</td>
                    <td style={styles.td}>{t.estimated_time}</td>
                    <td style={styles.td}>
                      LKR {Number(t.estimated_cost).toLocaleString("en-LK")}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => selectTransport(t)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "800",
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
    minHeight: "90px",
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
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearBtn: {
    background: "#64748b",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  tableBox: {
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

  tableScroll: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "820px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f1f5f9",
    color: "#0f172a",
    fontWeight: "900",
    borderBottom: "2px solid #e2e8f0",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#1e293b",
    fontWeight: "600",
  },

  editBtn: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },
};