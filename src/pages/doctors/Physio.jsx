import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./physio.css";

export default function Physio() {
  const [physios, setPhysios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    experience: "",
    designation: ""
  });

  const deletePhysio = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this doctor?");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("physiotherapists")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Delete failed ❌");
    return;
  }

  alert("Deleted successfully ✅");

  // refresh list
  fetchPhysios();
};

  // 🔄 FETCH
  const fetchPhysios = async () => {
    const { data, error } = await supabase
      .from("physiotherapists")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setPhysios(data || []);
  };

  useEffect(() => {
    fetchPhysios();
  }, []);

  // ➕ ADD / UPDATE
  const savePhysio = async () => {
  if (!form.name) {
    alert("Name required");
    return;
  }

  if (!form.name.includes("Dr") || !form.name.includes("PT")) {
    alert("Name must include 'Dr' and 'PT'");
    return;
  }

  const payload = {
    name: form.name,
    phone: form.phone || null,
    address: form.address || null,
    experience: form.experience
      ? parseInt(form.experience)
      : null,
    designation: form.designation || null
  };

  let response;

  if (editing) {
    response = await supabase
      .from("physiotherapists")
      .update(payload)
      .eq("id", editing.id)
      .select();
  } else {
    response = await supabase
      .from("physiotherapists")
      .insert([payload])
      .select();
  }

  const { data, error } = response;

  if (error) {
    console.error("Save error:", error);
    alert("Error saving doctor ❌");
    return;
  }

  console.log("Saved:", data);

  alert("Saved successfully ✅");

  setShowModal(false);
  setEditing(null);
  setForm({
    name: "",
    phone: "",
    address: "",
    experience: "",
    designation: ""
  });

  fetchPhysios();
};
  // ✏️ EDIT
  const handleEdit = (p) => {
    setEditing(p);

    setForm({
      name: p.name || "",
      phone: p.phone || "",
      address: p.address || "",
      experience: p.experience || "",
      designation: p.designation || ""
    });

    setShowModal(true);
  };


  const filteredPhysios = physios.filter((p) =>
  (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
  (p.phone || "").toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="physio-container">

      <div className="header">
        <h1>Physiotherapist Panel</h1>

        <input
  className="search-bar"
  placeholder="Search physiotherapist..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

        <button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              phone: "",
              address: "",
              experience: "",
              designation: ""
            });
            setShowModal(true);
          }}
        >
          + Add Doctor
        </button>
      </div>

      {/* LIST */}
      <div className="grid">
        {filteredPhysios.length === 0 && (
  <p style={{ textAlign: "center", opacity: 0.7 }}>
    No doctors found
  </p>
)}

        {filteredPhysios.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p><b>Phone:</b> {p.phone || "N/A"}</p>
            <p><b>Address:</b> {p.address || "N/A"}</p>
            <p><b>Experience:</b> {p.experience || 0} yrs</p>
            <p><b>Designation:</b> {p.designation || "N/A"}</p>

            <div className="card-actions">
  <button
    className="edit-btn"
    onClick={() => handleEdit(p)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => deletePhysio(p.id)}
  >
    Delete
  </button>
</div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">

            <h2>{editing ? "Edit Doctor" : "Add Doctor"}</h2>

            <input
              placeholder="Name (Dr ___ PT)"
              value={form.name || ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              placeholder="Address"
              value={form.address || ""}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <input
              placeholder="Experience (years)"
              type="number"
              value={form.experience || ""}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
            />

            <input
              placeholder="Designation"
              value={form.designation || ""}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={savePhysio}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}