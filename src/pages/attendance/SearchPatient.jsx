import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./styles/searchPatient.css";

export default function SearchPatient() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [physioName, setPhysioName] = useState("");

  const [treatment, setTreatment] = useState("");
  const [customDate, setCustomDate] = useState("");

  // 🔍 SEARCH
  const handleSearch = async (value) => {
  setSearch(value);

  if (!value.trim()) {
    setPatients([]);
    return;
  }

  const { data } = await supabase
    .from("patient_assignments")
    .select(`
      *,
      patients (*),
      physiotherapists (name)
    `)
    .ilike("patients.name", `%${value}%`);

  // ✅ REMOVE INVALID RECORDS
  const validPatients = (data || []).filter(p => p.patients);

  setPatients(validPatients);
};

  // 👤 SELECT
  const selectPatient = async (p) => {
    setSelectedPatient(p);
    setPhysioName(p.physiotherapists?.name || "");

    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", p.patient_id)
      .order("session_date", { ascending: true });

    setSessions(data || []);
  };

  // ➕ ADD SESSION
  const addSession = async () => {
    if (!selectedPatient) return;

    if (!treatment) {
      alert("Treatment is required ❌");
      return;
    }

    const sessionDate = customDate || new Date().toISOString();

    const { error } = await supabase.from("sessions").insert({
      patient_id: selectedPatient.patient_id,
      treatment,
      session_date: sessionDate
    });

    if (error) {
      console.error(error);
      alert("Error saving session");
      return;
    }

    setTreatment("");
    setCustomDate("");

    selectPatient(selectedPatient);
  };

  return (
    <div className="page-layout-vertical">

      {/* 🔍 TOP SEARCH */}
      {!selectedPatient && (
        <>
          <div className="top-search">
            <input
              placeholder="Search Assigned Patients..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* 📋 LIST */}
          {/* LIST */}
{search && patients.length > 0 && (
  <div className="list-container">
    {patients.map((p) => (
      <div
        key={p.id || p.patient_id}
        onClick={() => selectPatient(p)}
        className="card"
      >
        <b>{p.patients.name}</b>
<p>{p.patients.phone}</p>
      </div>
    ))}
  </div>
)}

{/* NOT FOUND */}
{patients.length === 0 && search && (
  <p style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
    No patient found
  </p>
)}
        </>
      )}

      {/* 📄 DETAIL VIEW */}
      {selectedPatient && (
  <div className="detail-container">

    {/* ===== LEFT PANEL ===== */}
    <div>

      

      <h2>{selectedPatient.patients.name}</h2>

      <p><b>Phone:</b> {selectedPatient.patients.phone}</p>
      <p><b>Physio:</b> {physioName}</p>
      <p><b>Cost:</b> ₹{selectedPatient.cost_per_session || "N/A"}</p>

      <h3>Add Session</h3>

      <textarea
        placeholder="Enter Treatment (Required)"
        value={treatment}
        onChange={(e) => setTreatment(e.target.value)}
      />

      <input
        type="date"
        value={customDate}
        onChange={(e) => setCustomDate(e.target.value)}
      />

      <button onClick={addSession}>
        + Save Session
      </button>

    </div>

    {/* ===== RIGHT PANEL ===== */}
    <div>

      <h3>All Sessions</h3>

      {sessions.length === 0 && <p>No sessions yet</p>}

      {sessions.map((s, i) => (
        <div key={s.id} className="session-card">
          <b>Session {i + 1}</b>
          <p>{new Date(s.session_date).toLocaleDateString()}</p>
          <p>{s.treatment}</p>
        </div>
      ))}

    </div>

  </div>
)}
   </div>
  );
}