import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./bill.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Bill() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 🔍 SEARCH */
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    const { data } = await supabase
      .from("patients")
      .select("*")
      .ilike("name", `%${value}%`)
      .limit(5);

    setResults(data || []);
  };

  /* 👤 SELECT PATIENT */
  const handleSelect = async (patient) => {
    setSelected(patient);
    setQuery(patient.name);
    setResults([]);

    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", patient.patient_id);

    const totalSessions = sessions.length;
    const totalCost = sessions.reduce(
      (sum, s) => sum + (s.cost || 0),
      0
    );

    setSummary({ totalSessions, totalCost });
  };

  /* 🖨 PRINT */
  const handlePrint = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://physio-main.onrender.com/generate-bill-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient_id: selected.patient_id
        })
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url);
      printWindow.onload = () => {
        printWindow.print();
      };

    } catch (err) {
      console.error(err);
      alert("Error generating bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bill-container">

      <h1>Bill Receipt</h1>

      <div className="bill-card">

        {/* SEARCH INPUT */}
        <input
          className="bill-input"
          placeholder="Search patient name"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* SEARCH RESULTS */}
        {results.length > 0 && (
          <div className="bill-results">
            {results.map((p) => (
              <div
                key={p.id}
                className="bill-item"
                onClick={() => handleSelect(p)}
              >
                <strong>{p.name}</strong>
                <span>({p.phone})</span>
              </div>
            ))}
          </div>
        )}

        {/* SELECTED INFO */}
        {selected && summary && (
          <div className="bill-info">

            <div className="bill-row">
              <b>Name:</b>
              <span className="bill-value">{selected.name}</span>
            </div>

            <div className="bill-row">
              <b>Phone:</b>
              <span className="bill-value">{selected.phone}</span>
            </div>

            <div className="bill-row">
              <b>Total Sessions:</b>
              <span className="bill-value">{summary.totalSessions}</span>
            </div>

            <div className="bill-row">
              <b>Total Cost:</b>
              <span className="bill-value">₹{summary.totalCost}</span>
            </div>

            <button
              className="bill-btn"
              onClick={handlePrint}
              disabled={loading}
            >
              {loading ? "Generating..." : "Print Receipt"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
