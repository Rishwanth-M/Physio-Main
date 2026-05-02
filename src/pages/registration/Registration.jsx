import { useState, useEffect } from "react";
import PatientForm from "../../components/PatientForm";
import { supabase } from "../../lib/supabase";
import "./ui.css";

export default function Registration() {   // 🔥 rename
  const [form, setForm] = useState({});
  const [patientId, setPatientId] = useState("");
  const [saved, setSaved] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [todayDate, setTodayDate] = useState("");

  // 🔥 AUTO GENERATE PATIENT ID (NO BUTTON NEEDED)
  useEffect(() => {
    const id = "VR-" + Math.floor(100000 + Math.random() * 900000);
    setPatientId(id);
  }, []);

  useEffect(() => {
  const today = new Date();
  const formatted =
    today.getDate().toString().padStart(2, "0") + "/" +
    (today.getMonth() + 1).toString().padStart(2, "0") + "/" +
    today.getFullYear();

  setTodayDate(formatted);
}, []);

  const saveData = async () => {
  try {
    const id = patientId || "VR-" + Math.floor(100000 + Math.random() * 900000);

    if (!form.firstName || !form.mobile) {
      alert("Please fill required fields");
      return;
    }

    const res = await fetch("http://localhost:5000/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        patientId: id
      })
    });

    if (!res.ok) throw new Error("PDF generation failed");

    const blob = await res.blob();

    const cleanName = `${form.firstName || "patient"}_${form.surname || ""}`
      .replace(/\s+/g, "_");

    const fileName = `${cleanName}-${id}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, blob, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      console.error(uploadError);
      alert("Upload failed");
      return;
    }

    const finalPdfUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/pdfs/${fileName}`;

    const { error: dbError } = await supabase.from("patients").insert({
      patient_id: id,
      name: `${form.firstName || ""} ${form.surname || ""}`,
      phone: form.mobile,
      email: form.email,
      diagnosed_with: form.diagnosedWith,
      data: form,
      pdf_url: finalPdfUrl
    });

    if (dbError) {
      console.error(dbError);
      alert("DB insert failed");
      return;
    }

    setPdfUrl(finalPdfUrl);
    setSaved(true);

  } catch (err) {
    console.error(err);
    alert("Something failed");
  }
};

  return (
    <div className="container">
      <h1 className="title">VR Physio Registration</h1>

      {/* ✅ AUTO GENERATED ID */}
      <div className="row" style={{ justifyContent: "space-between" }}>
  <p><b>Patient ID:</b> {patientId}</p>
  <p><b>Date:</b> {todayDate}</p>
</div>

      {/* ✅ CORRECT PROPS */}
      <PatientForm form={form} setForm={setForm} />

      {!saved ? (
        <button className="btn" onClick={saveData}>
          Save
        </button>
      ) : (
        <button
          className="btn btn-black"
          onClick={() => window.open(pdfUrl, "_blank")}
        >
          Print PDF
        </button>
      )}
    </div>
  );
}