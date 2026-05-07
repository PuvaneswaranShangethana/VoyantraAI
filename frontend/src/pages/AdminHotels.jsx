import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminHotels({ setPage }) {
  const [hotels, setHotels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isTablet = screenWidth < 1024;
  const isMobile = screenWidth < 768;

  const [form, setForm] = useState({
    hotel_name: "",
    destination_id: "",
    hotel_type: "",
    price_per_night: "",
    rating: "",
    contact_number: "",
  });

  useEffect(() => {
    loadHotels();

    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const loadHotels = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/hotels");
      setHotels(res.data);
    } catch {
      alert("Failed to load hotels");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      hotel_name: "",
      destination_id: "",
      hotel_type: "",
      price_per_night: "",
      rating: "",
      contact_number: "",
    });
    setSelectedId(null);
    setMessage("");
  };

  const saveHotel = async () => {
  if (
    !form.hotel_name ||
    !form.destination_id ||
    !form.hotel_type ||
    !form.price_per_night ||
    !form.rating ||
    !form.contact_number
  ) {
    alert("Please fill all fields");
    return;
  }

  if (Number(form.rating) < 1 || Number(form.rating) > 5) {
    alert("Rating must be between 1 and 5");
    return;
  }

  const data = {
    hotel_name: form.hotel_name,
    destination_id: Number(form.destination_id),
    hotel_type: form.hotel_type,
    price_per_night: Number(form.price_per_night),
    rating: Number(form.rating),
    contact_number: form.contact_number,
  };

  try {
    if (selectedId) {
      await axios.put(`http://127.0.0.1:8000/hotels/${selectedId}`, data);
      setMessage("✅ Hotel updated successfully");
    } else {
      await axios.post("http://127.0.0.1:8000/hotels", data);
      setMessage("✅ Hotel saved successfully");
    }

    await loadHotels();
    resetForm();
  } catch (error) {
    alert(error.response?.data?.detail || "Hotel save/update failed");
  }
};

  const deleteHotel = async () => {
    if (!selectedId) {
      alert("Select a hotel first");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/hotels/${selectedId}`);
      setMessage("🗑️ Hotel deleted successfully");
      loadHotels();
      resetForm();
    } catch {
      alert("Hotel delete failed");
    }
  };

  const selectHotel = (h) => {
    setSelectedId(h.hotel_id);
    setForm({
      hotel_name: h.hotel_name || "",
      destination_id: h.destination_id || "",
      hotel_type: h.hotel_type || "",
      price_per_night: h.price_per_night || "",
      rating: h.rating || "",
      contact_number: h.contact_number || "",
    });
    setMessage(`✏️ Selected hotel ID ${h.hotel_id}`);
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
          <h1 style={styles.title}>🏨 Admin Hotels</h1>
          <p style={styles.subtitle}>
            Add, edit, delete, and manage hotel records.
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
            {selectedId ? "Selected Hotel" : "Hotel Management"}
          </h2>

          {message && <div style={styles.message}>{message}</div>}

          <input
            name="hotel_name"
            value={form.hotel_name}
            onChange={handleChange}
            placeholder="Hotel Name"
            style={styles.input}
          />

          <input
            name="destination_id"
            value={form.destination_id}
            onChange={handleChange}
            placeholder="Destination ID e.g. 1"
            type="number"
            style={styles.input}
          />
          <p style={styles.helpText}>
            Destination ID must already exist in the destinations table.
          </p>

          <select
            name="hotel_type"
            value={form.hotel_type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Hotel Type</option>
            <option value="Budget">Budget</option>
            <option value="Mid">Mid</option>
            <option value="Luxury">Luxury</option>
            <option value="Villa">Villa</option>
            <option value="Resort">Resort</option>
          </select>

          <input
            name="price_per_night"
            value={form.price_per_night}
            onChange={handleChange}
            placeholder="Price Per Night in LKR"
            type="number"
            style={styles.input}
          />

          <input
            name="rating"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating 1 - 5"
            type="number"
            min="1"
            max="5"
            step="0.1"
            style={styles.input}
          />

          <input
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            placeholder="Contact Number"
            style={styles.input}
          />

          <div style={styles.btnRow}>
            <button style={styles.saveBtn} onClick={saveHotel}>
              {selectedId ? "Update" : "Save"}
            </button>

            <button style={styles.deleteBtn} onClick={deleteHotel}>
              Delete
            </button>

            <button style={styles.clearBtn} onClick={resetForm}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ ...styles.tableBox, width: isTablet ? "100%" : "60%" }}>
          <h2 style={styles.tableTitle}>Hotel List</h2>

          <div style={styles.tableScroll}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {hotels.map((h) => (
                  <tr
                    key={h.hotel_id}
                    style={{
                      background:
                        selectedId === h.hotel_id ? "#dbeafe" : "#ffffff",
                    }}
                  >
                    <td style={styles.td}>{h.hotel_id}</td>
                    <td style={styles.td}>{h.hotel_name}</td>
                    <td style={styles.td}>{h.hotel_type}</td>
                    <td style={styles.td}>
                      LKR {Number(h.price_per_night).toLocaleString("en-LK")}
                    </td>
                    <td style={styles.td}>⭐ {h.rating}</td>
                    <td style={styles.td}>
                      <button onClick={() => selectHotel(h)} style={styles.editBtn}>
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
    borderRadius: "10px",
    border: "none",
    fontWeight: "800",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearBtn: {
    background: "#64748b",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "800",
    cursor: "pointer",
  },

  message: {
    background: "#dcfce7",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
    color: "#166534",
    fontWeight: "800",
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
    minWidth: "760px",
    borderCollapse: "collapse",
  },

  th: {
    background: "#f1f5f9",
    padding: "12px",
    textAlign: "left",
    fontWeight: "900",
    color: "#0f172a",
    borderBottom: "2px solid #e2e8f0",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: "600",
    color: "#1e293b",
  },

  editBtn: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "7px 12px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "800",
    cursor: "pointer",
  },
};