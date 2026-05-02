import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "./styles/AddPatient.css";

export default function AddPatient() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [physios, setPhysios] = useState([]);
  const [selectedPhysio, setSelectedPhysio] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    loadPhysios();
  }, []);

  // 🔹 Load Physios
  const loadPhysios = async () => {
    const { data } = await supabase
      .from("physiotherapists")
      .select("*");

    setPhysios(data || []);
  };

  // 🔍 Search Patients
  const searchPatients = async (value) => {
  setSearch(value);

  if (!value.trim()) {
    setPatients([]);
    return;
  }

  const { data } = await supabase
    .from("patients")
    .select("*")
    .or(`name.ilike.%${value}%,phone.ilike.%${value}%`);

  setPatients(data || []);
  console.log("Search Results:", data);
};

  // 👤 Select Patient
  const selectPatient = (p) => {
    setSelectedPatient(p);
  };

  // 💾 Save Assignment
  const saveAssignment = async () => {
    if (!selectedPatient || !selectedPhysio || !cost) {
      alert("Please fill all fields");
      return;
    }

    // 🔥 Prevent duplicate assignment
    const { data: existing } = await supabase
      .from("patient_assignments")
      .select("*")
      .eq("patient_id", selectedPatient.patient_id)
      .maybeSingle();

    if (existing) {
      alert("Patient already assigned ❌");
      return;
    }

    const { error } = await supabase
      .from("patient_assignments")
      .insert({
        patient_id: selectedPatient.patient_id,
        physio_id: selectedPhysio,
        cost_per_session: cost
      });

    if (error) {
      console.error(error);
      alert("Error saving assignment");
      return;
    }

    alert("Assigned successfully ✅");

    // 🔄 Reset everything
    setSelectedPatient(null);
    setSearch("");
    setPatients([]);
    setSelectedPhysio("");
    setCost("");
  };

  return (
    <div className="page-layout-vertical">

      {/* 🔍 SEARCH */}
      {!selectedPatient && (
        <>
          <div className="top-search">
            <input
              placeholder="Search Registered Patients..."
              value={search}
              onChange={(e) => searchPatients(e.target.value)}
            />
          </div>

          {/* 📋 RESULTS */}
          {search && patients.length > 0 && (
            <>
              <p style={{ marginBottom: 10, color: "#555" }}>
                Search Results
              </p>

              <div className="list-container">
                {patients.map((p) => (
                  <div
                    key={p.patient_id}
                    onClick={() => selectPatient(p)}
                    className="card"
                  >
                    <b>{p.name}</b>
                    <p>{p.phone}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ❌ NO RESULT */}
          {patients.length === 0 && search && (
            <p style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
              No patient found
            </p>
          )}
        </>
      )}

      {/* 📄 DETAIL */}
      {selectedPatient && (
        <div className="detail-container">

  <h2 className="full">{selectedPatient.name}</h2>

  <p><b>Phone:</b> {selectedPatient.phone}</p>
  <p><b>Condition:</b> {selectedPatient.diagnosed_with}</p>

  <select
    value={selectedPhysio}
    onChange={(e) => setSelectedPhysio(e.target.value)}
  >
    <option value="">Select Physiotherapist</option>
    {physios.map((p) => (
      <option key={p.id} value={p.id}>
        {p.name}
      </option>
    ))}
  </select>

  <input
    placeholder="Cost per session"
    value={cost}
    onChange={(e) => setCost(e.target.value)}
  />

  <button onClick={saveAssignment}>
    Save Assignment
  </button>

</div>
      )}

    </div>
  );
}