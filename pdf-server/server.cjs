require("dotenv").config();

const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// templates
const generateHTML = require("./templates/index"); // registration
const generateTreatmentHTML = require("./templates/treatmentTemplate");
const generateBillHTML = require("./templates/billTemplate");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* ================= GENERIC PDF (KEEP) ================= */
app.post("/generate-pdf", async (req, res) => {
  try {
    const data = req.body;

    const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless
});
    const page = await browser.newPage();

    const html = generateHTML(data);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({ "Content-Type": "application/pdf" });
    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("PDF Error");
  }
});


/* ================= 🔥 NEW: REGISTER + PDF ================= */
app.post("/register-and-generate-pdf", async (req, res) => {
  try {
    const data = req.body;

    /* ---------- 1. SAVE TO SUPABASE ---------- */
    const { error } = await supabase
      .from("patients")
      .insert({
        patient_id: data.patientId,
        name: `${data.firstName} ${data.middleName || ""} ${data.surname || ""}`.trim(),
        phone: data.mobile,
        email: data.email,
        diagnosed_with: data.diagnosedWith,
        data: data // 🔥 JSONB FULL STORAGE
      });

    if (error) {
      console.error(error);
      return res.status(500).send("Database Error");
    }

    /* ---------- 2. GENERATE PDF ---------- */
    const html = generateHTML(data);

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless
});
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    /* ---------- 3. SEND PDF ---------- */
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${data.patientId}.pdf`
    });

    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Registration PDF Error");
  }
});


/* ================= TREATMENT PDF ================= */
app.post("/generate-treatment-pdf", async (req, res) => {
  try {
    const { patient_id } = req.body;

    if (!patient_id) {
      return res.status(400).send("patient_id required");
    }

    /* ---------- 1. Fetch Patient ---------- */
    const { data: patient, error: pError } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patient_id)
      .single();

    if (pError || !patient) {
      return res.status(404).send("Patient not found");
    }

    /* ---------- 2. Fetch Sessions ---------- */
    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", patient_id)
      .order("session_date", { ascending: true });

    /* ---------- 3. Fetch Physios ---------- */
    const physioIds = [...new Set(sessions.map(s => s.physio_id))];

    let physioMap = {};

    if (physioIds.length > 0) {
      const { data: physios } = await supabase
        .from("physiotherapists")
        .select("id, name, designation, phone")
        .in("id", physioIds);

      physios.forEach(p => {
        physioMap[p.id] = {
          name: p.name,
          designation: p.designation,
          phone: p.phone
        };
      });
    }

    /* ---------- 4. Total Cost ---------- */
    const totalCost = sessions.reduce(
      (sum, s) => sum + (s.cost || 0),
      0
    );

    /* ---------- 5. Generate HTML ---------- */
    const html = generateTreatmentHTML({
      patient,
      sessions,
      totalCost,
      physioMap
    });

    /* ---------- ✅ SEND HTML (FOR PRINT) ---------- */
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", "inline");

    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating treatment report");
  }
});

app.post("/generate-bill-pdf", async (req, res) => {
  try {
    const { patient_id } = req.body;

    /* ---------- 1. FETCH PATIENT ---------- */
    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patient_id)
      .single();

    /* ---------- 2. FETCH SESSIONS ---------- */
    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", patient_id);

    const totalSessions = sessions.length;
    const totalCost = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);

    /* ---------- 3. GENERATE HTML ---------- */
    const html = generateBillHTML({
      patient,
      sessions,
      totalSessions,
      totalCost
    });

    const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless
});
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
    });

    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Bill generation error");
  }
});


/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
