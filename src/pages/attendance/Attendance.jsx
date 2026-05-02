import { useState } from "react";
import AddPatient from "./AddPatient";
import SearchPatient from "./SearchPatient";
import "./styles/attendance.css";

export default function Attendance() {
  const [page, setPage] = useState(null); // null = show options

  return (
    <div className="attendance-container">

      {/* 🔥 HEADER */}
      <div className="attendance-header">
        <h2>Attendance and New Patient Information</h2>

        {/* Show back button only when inside a page */}
        {page && (
          <button className="back-btn" onClick={() => setPage(null)}>
            ← Back
          </button>
        )}
      </div>

      {/* 🔵 INITIAL OPTIONS */}
      {!page && (
        <div className="attendance-options">
          <button onClick={() => setPage("search")}>
            🔍 Patient Session Record
          </button>

          <button onClick={() => setPage("add")}>
            ➕ Add New Patient
          </button>
        </div>
      )}

      {/* 🟢 PAGES */}
      {page === "search" && <SearchPatient />}
      {page === "add" && <AddPatient />}

    </div>
  );
}