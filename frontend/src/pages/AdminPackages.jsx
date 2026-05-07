import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPackages({ setPage }) {
  const [packages, setPackages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isTablet = screenWidth < 1024;

  const [form, setForm] = useState({
    package_name: "",
    destination_id: "",
    duration_days: "",
    price: "",
    category: "",
    activities: "",
  });

  useEffect(() => {
    loadPackages();

    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const loadPackages = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/packages");
      setPackages(res.data);
    } catch {
      alert("Failed to load packages");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      package_name: "",
      destination_id: "",
      duration_days: "",
      price: "",
      category: "",
      activities: "",
    });
    setSelectedId(null);
    setMessage("");
  };

  const savePackage = async () => {
  if (
    !form.package_name ||
    !form.destination_id ||
    !form.duration_days ||
    !form.price ||
    !form.category ||
    !form.activities
  ) {
    alert("Please fill all fields");
    return;
  }

  const data = {
    package_name: form.package_name,
    destination_id: Number(form.destination_id),
    duration_days: Number(form.duration_days),
    price: Number(form.price),
    category: form.category,
    activities: form.activities,
  };

  try {
    if (selectedId) {
      await axios.put(`http://127.0.0.1:8000/packages/${selectedId}`, data);
      setMessage("✅ Package updated successfully");
    } else {
      await axios.post("http://127.0.0.1:8000/packages", data);
      setMessage("✅ Package saved successfully");
    }

    await loadPackages();
    resetForm();
  } catch (error) {
    alert(error.response?.data?.detail || "Package save/update failed");
  }
};

  const deletePackage = async () => {
    if (!selectedId) {
      alert("Select a package first");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/packages/${selectedId}`);
      setMessage("🗑️ Package deleted successfully");
      loadPackages();
      resetForm();
    } catch {
      alert("Package delete failed");
    }
  };

  const selectPackage = (p) => {
    setSelectedId(p.package_id);
    setForm({
      package_name: p.package_name || "",
      destination_id: p.destination_id || "",
      duration_days: p.duration_days || "",
      price: p.price || "",
      category: p.category || "",
      activities: p.activities || "",
    });
    setMessage(`✏️ Selected package ID ${p.package_id}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>📦 Admin Packages</h1>
          <p style={styles.headerText}>
            Add, edit, delete, and manage travel package records.
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
            {selectedId ? "Selected Package" : "Add Package"}
          </h2>

          {message && <div style={styles.messageBox}>{message}</div>}

          <input
            name="package_name"
            value={form.package_name}
            onChange={handleChange}
            placeholder="Package Name"
            style={styles.input}
          />

          <input
            name="destination_id"
            value={form.destination_id}
            onChange={handleChange}
            placeholder="Destination ID e.g. 1"
            style={styles.input}
          />
          <p style={styles.helpText}>
            Destination ID must already exist in the destinations table.
          </p>

          <input
            name="duration_days"
            value={form.duration_days}
            onChange={handleChange}
            placeholder="Duration Days"
            type="number"
            style={styles.input}
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price in LKR"
            type="number"
            style={styles.input}
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            style={styles.input}
          />

          <textarea
            name="activities"
            value={form.activities}
            onChange={handleChange}
            placeholder="Activities"
            style={styles.textarea}
          />

          <div style={styles.btnRow}>
            <button style={styles.saveBtn} onClick={savePackage}>
              {selectedId ? "Update" : "Save"}
            </button>

            <button style={styles.deleteBtn} onClick={deletePackage}>
              Delete
            </button>

            <button style={styles.clearBtn} onClick={resetForm}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ ...styles.tableBox, width: isTablet ? "100%" : "60%" }}>
          <h2 style={styles.tableTitle}>Package List</h2>

          <div style={styles.tableScroll}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Days</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {packages.map((p) => (
                  <tr
                    key={p.package_id}
                    style={{
                      background:
                        selectedId === p.package_id ? "#dbeafe" : "#ffffff",
                    }}
                  >
                    <td style={styles.td}>{p.package_id}</td>
                    <td style={styles.td}>{p.package_name}</td>
                    <td style={styles.td}>{p.duration_days}</td>
                    <td style={styles.td}>
                      LKR {Number(p.price).toLocaleString("en-LK")}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => selectPackage(p)}
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
    fontFamily: "Segoe UI, sans-serif",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    gap: "15px",
  },

  headerTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "900",
    color: "#020617",
  },

  headerText: {
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

  messageBox: {
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

  helpText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
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
    minWidth: "650px",
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