import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./treatment.css";

/* ========= SUPABASE INIT ========= */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Treatment = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH PATIENT ================= */
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    const { data } = await supabase
      .from("patients")
      .select("*")
      .or(`name.ilike.%${value}%,phone.ilike.%${value}%`)
      .limit(5);

    setResults(data || []);
  };

  /* ================= SELECT PATIENT ================= */
  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setResults([]);
    setQuery(patient.name);

    /* ---- fetch sessions ---- */
    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", patient.patient_id);

    const totalSessions = sessions.length;
    const totalCost = sessions.reduce(
      (sum, s) => sum + (s.cost || 0),
      0
    );

    setSessionData({
      totalSessions,
      totalCost
    });
  };

  /* ================= GENERATE PDF ================= */
  const handleGeneratePDF = async () => {
  if (!selectedPatient) {
    alert("Select a patient first");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/generate-treatment-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patient_id: selectedPatient.patient_id
      })
    });

    const blob = await res.blob();   // ✅ same as bill
    const url = URL.createObjectURL(blob);

    const printWindow = window.open(url);

    printWindow.onload = () => {
      printWindow.print();
    };

  } catch (err) {
    console.error(err);
    alert("Error generating report");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="treatment-container">

      <h1>Treatment Report</h1>

      <div className="card">

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search by name or phone"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* SEARCH RESULTS */}
        {results.length > 0 && (
          <div className="results">
            {results.map((p) => (
              <div
                key={p.id}
                className="result-item"
                onClick={() => handleSelectPatient(p)}
              >
                <strong>{p.name}</strong>
                <span>{p.phone}</span>
              </div>
            ))}
          </div>
        )}

        {/* SELECTED PATIENT INFO */}
        {selectedPatient && sessionData && (
          <div className="patient-info">

            <p>
  <strong>Name:</strong>
  <span>{selectedPatient.name}</span>
</p>

<p>
  <strong>Phone:</strong>
  <span>{selectedPatient.phone}</span>
</p>

<p>
  <strong>Total Sessions:</strong>
  <span>{sessionData.totalSessions}</span>
</p>

<p>
  <strong>Total Cost:</strong>
  <span>₹{sessionData.totalCost}</span>
</p>
            <button onClick={handleGeneratePDF} disabled={loading}>
              {loading ? "Generating..." : "Print Treatment Report"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Treatment;