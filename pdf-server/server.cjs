require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 ENV CHECK
const isLocal = process.env.NODE_ENV !== "production";

// 🔥 SUPABASE
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔥 TEMPLATES
const generateHTML = require("./templates/index");
const generateTreatmentHTML = require("./templates/treatmentTemplate");
const generateBillHTML = require("./templates/billTemplate");


// =======================================================
// 🔥 UNIVERSAL BROWSER LAUNCH (LOCAL + RENDER)
// =======================================================
async function launchBrowser() {
  if (isLocal) {
    const puppeteer = require("puppeteer");

    return await puppeteer.launch({
      headless: true
    });

  } else {
    const puppeteer = require("puppeteer-core");
    const chromium = require("@sparticuz/chromium");

    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true
    });
  }
}


// =======================================================
// 🔥 GENERIC PDF
// =======================================================
app.post("/generate-pdf", async (req, res) => {
  try {
    const html = generateHTML(req.body);

    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

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


// =======================================================
// 🔥 REGISTER + PDF
// =======================================================
app.post("/register-and-generate-pdf", async (req, res) => {
  try {
    const data = req.body;

    const { error } = await supabase
      .from("patients")
      .insert({
        patient_id: data.patientId,
        name: `${data.firstName} ${data.middleName || ""} ${data.surname || ""}`.trim(),
        phone: data.mobile,
        email: data.email,
        diagnosed_with: data.diagnosedWith,
        data: data
      });

    if (error) return res.status(500).send("Database Error");

    const html = generateHTML(data);

    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

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


// =======================================================
// 🔥 TREATMENT REPORT (HTML PRINT)
// =======================================================
app.post("/generate-treatment-pdf", async (req, res) => {
  try {
    const { patient_id } = req.body;

    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patient_id)
      .single();

    if (!patient) return res.status(404).send("Patient not found");

    const { data: sessionsRaw } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", patient_id)
      .order("session_date", { ascending: true });

    const sessions = sessionsRaw || [];

    const physioIds = [
      ...new Set(sessions.map(s => s.physio_id).filter(Boolean))
    ];

    let physioMap = {};

    if (physioIds.length > 0) {
      const { data: physios } = await supabase
        .from("physiotherapists")
        .select("id, name, designation, phone")
        .in("id", physioIds);

      (physios || []).forEach(p => {
        physioMap[p.id] = p;
      });
    }

    const totalCost = sessions.reduce(
      (sum, s) => sum + (s.cost || 0),
      0
    );

    const html = generateTreatmentHTML({
      patient,
      sessions,
      totalCost,
      physioMap
    });

    res.setHeader("Content-Type", "text/html");
    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send("Treatment error");
  }
});


// =======================================================
// 🔥 BILL PDF
// =======================================================
app.post("/generate-bill-pdf", async (req, res) => {
  try {
    const { patient_id } = req.body;

    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patient_id)
      .single();

    const { data: sessionsRaw } = await supabase
      .from("sessions")
      .select("*")
      .eq("patient_id", patient_id);

    const sessions = sessionsRaw || [];

    const totalSessions = sessions.length;
    const totalCost = sessions.reduce(
      (sum, s) => sum + (s.cost || 0),
      0
    );

    const html = generateBillHTML({
      patient,
      sessions,
      totalSessions,
      totalCost
    });

    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({ "Content-Type": "application/pdf" });
    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Bill generation error");
  }
});


// =======================================================
// 🚀 SERVER
// =======================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
