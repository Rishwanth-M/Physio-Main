const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "../assets/logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN");
};

module.exports = function generateTreatmentHTML({
  patient,
  sessions,
  totalCost,
  physioMap
}) {

  const d = patient.data || {};   // 🔥 JSONB FIX

  const totalSessions = sessions.length;
  const costPerSession = sessions[0]?.cost || 0;

  const mainPhysio =
    physioMap[sessions[0]?.physio_id] || "Physiotherapist";

  return `
  <html>
  <head>
    <style>

      body {
        font-family: Arial, sans-serif;
        margin: 40px;   /* ✅ PAGE MARGIN FIX */
      }

      /* ===== HEADER ===== */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
      }

      .logo {
        height: 70px;
      }

      .center {
        text-align: center;
        flex: 1;
      }

      .center h1 {
        margin: 0;
        font-size: 20px;
      }

      .center p {
        margin: 2px 0;
        font-size: 11px;
      }

      .right {
        text-align: right;
        font-size: 11px;
      }

      /* ===== TITLE ===== */
      .title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin: 15px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      table, td, th {
        border: 1px solid #000;
      }

      td {
        padding: 8px;
      }

      .label {
        font-weight: bold;
        background: #f5f5f5;
        width: 25%;
      }

      .section-title {
        margin: 15px 0 5px;
        font-weight: bold;
        text-align: center;
      }

      .summary th {
        background: #f0f0f0;
      }

      .summary td {
        text-align: center;
        font-weight: bold;
      }

      .physio {
        margin-top: 15px;
        border: 1px solid #000;
        padding: 10px;
      }

      .note {
        margin-top: 15px;
        font-size: 11px;
        border: 1px dashed #000;
        padding: 10px;
      }

      /* ✅ SIGNATURE FIXED TO BOTTOM */
      .signatures {
  position: fixed;
  bottom: 40px;
  left: 40px;
  right: 40px;
  display: flex;
  justify-content: space-between;
}

.sign-box {
  width: 45%;
  text-align: center;
  font-size: 12px;
}

.line {
  margin-top: 60px;
  border-top: 1px solid #000;
}

.sign-label {
  margin-top: 5px;
  font-weight: bold;
}

      .page-break {
        page-break-before: always;
      }

    </style>
  </head>

  <body>

    <!-- HEADER -->
    <div class="header">

      <img src="data:image/png;base64,${logoBase64}" class="logo"/>

      <div class="center">
        <h1>VR Physio Rehab Pvt. Ltd.</h1>
        <p><strong>Dr. Venkat R Manda PT</strong></p>
        <p>M.P.T Ortho | M.I.A.P | Ph.D (Ortho)</p>
        <p>Director</p>
      </div>

      <div class="right">
        VR Physio Rehab<br/>
        Aditya Ellen Plaza<br/>
        Femcity Hospital<br/>
        Shaikpet Rd<br/>
        Hyderabad - 500096<br/>
        +91 77949 21287
      </div>

    </div>

    <div class="title">Patient Treatment Report</div>

    <!-- 🔥 FULL DATA FROM JSONB -->
    <table>
      <tr>
        <td class="label">Patient ID</td>
        <td>${patient.patient_id}</td>
        <td class="label">Date</td>
        <td>${formatDate(new Date())}</td>
      </tr>

      <tr>
        <td class="label">Name</td>
        <td>${d.title || ""} ${d.firstName || ""} ${d.middleName || ""} ${d.surname || ""}</td>
        <td class="label">Gender</td>
        <td>${d.gender || "-"}</td>
      </tr>

      <tr>
        <td class="label">DOB</td>
        <td>${d.dob || "-"}</td>
        <td class="label">Age</td>
        <td>${d.age || "-"}</td>
      </tr>

      <tr>
        <td class="label">Address</td>
        <td colspan="3">${d.address || "-"}</td>
      </tr>

      <tr>
        <td class="label">Mobile</td>
        <td>${d.mobile || patient.phone}</td>
        <td class="label">Email</td>
        <td>${d.email || patient.email}</td>
      </tr>

      <tr>
        <td class="label">Insurance</td>
        <td>${d.insurance || "-"}</td>
        <td class="label">Diagnosed With</td>
        <td>${d.diagnosedWith || patient.diagnosed_with}</td>
      </tr>

      <tr>
        <td class="label">Referral Type</td>
        <td>${d.referral || "-"}</td>
        <td class="label">Doctor</td>
        <td>${d.doctorRef || "-"}</td>
      </tr>

      <tr>
        <td class="label">Medical History</td>
        <td colspan="3">${d.medicalHistory || "-"}</td>
      </tr>
    </table>

    <!-- SUMMARY -->
    <div class="section-title">Treatment Summary</div>

    <table class="summary">
      <tr>
        <th>Total Sessions</th>
        <th>Cost / Session</th>
        <th>Total Cost</th>
      </tr>
      <tr>
        <td>${totalSessions}</td>
        <td>₹${costPerSession}</td>
        <td>₹${totalCost}</td>
      </tr>
    </table>

    <!-- PHYSIO -->
    <table style="margin-top:15px;">
  <tr>
    <td class="label">Treated By</td>
    <td>${physioMap[sessions[0]?.physio_id]?.name || "-"}</td>
  </tr>
  <tr>
    <td class="label">Designation</td>
    <td>${physioMap[sessions[0]?.physio_id]?.designation || "-"}</td>
  </tr>
  <tr>
    <td class="label">Contact</td>
    <td>${physioMap[sessions[0]?.physio_id]?.phone || "-"}</td>
  </tr>
</table>

    <!-- NOTE -->
    <div class="note">
      This report is generated based on physiotherapy sessions conducted. 
      It is for clinical reference only and cannot be used as a bill, GST document, or for insurance claims.
    </div>

    <!-- SIGNATURE -->
    <div class="signatures">
  <div class="sign-box">
    <div class="line"></div>
    <div class="sign-label">Physiotherapist Signature</div>
  </div>

  <div class="sign-box">
    <div class="line"></div>
    <div class="sign-label">VR Physio Rehab Pvt. Ltd. Stamp</div>
  </div>
</div>

    <!-- PAGE 2 -->
    <div class="page-break"></div>

    <div class="header" style="margin-top:20px;">

      <img src="data:image/png;base64,${logoBase64}" class="logo"/>

      <div class="center">
        <h1>VR Physio Rehab Pvt. Ltd.</h1>
        <p><strong>Dr. Venkat R Manda PT</strong></p>
        <p>M.P.T Ortho | M.I.A.P | Ph.D (Ortho)</p>
        <p>Director</p>
      </div>

      <div class="right">
        VR Physio Rehab<br/>
        Aditya Ellen Plaza<br/>
        Femcity Hospital<br/>
        Shaikpet Rd<br/>
        Hyderabad - 500096<br/>
        +91 77949 21287
      </div>

    </div>

    <div class="title">Session Details</div>

    <table>
      <tr>
        <th>#</th>
        <th>Date</th>
        <th>Treatment</th>
        <th>Cost</th>
        <th>Physio</th>
      </tr>

      ${sessions.map((s, i) => {

  const row = `
    <tr>
      <td>${i + 1}</td>
      <td>${formatDate(s.session_date)}</td>
      <td>${s.treatment}</td>
      <td>₹${s.cost}</td>
      <td>${physioMap[s.physio_id]?.name || "-"}</td>
    </tr>
  `;

  // After every 12 rows → break page
  if ((i + 1) % 18 === 0) {
    return row + `
      </table>

      <div class="signatures">
        <div class="sign-box">
          <div class="line"></div>
          <div class="sign-label">Physiotherapist Signature</div>
        </div>

        <div class="sign-box">
          <div class="line"></div>
          <div class="sign-label">VR Physio Rehab Pvt. Ltd. Stamp</div>
        </div>
      </div>

      <div class="page-break"></div>

      <div class="header" style="margin-top:20px;">

      <img src="data:image/png;base64,${logoBase64}" class="logo"/>

      <div class="center">
        <h1>VR Physio Rehab Pvt. Ltd.</h1>
        <p><strong>Dr. Venkat R Manda PT</strong></p>
        <p>M.P.T Ortho | M.I.A.P | Ph.D (Ortho)</p>
        <p>Director</p>
      </div>

      <div class="right">
        VR Physio Rehab<br/>
        Aditya Ellen Plaza<br/>
        Femcity Hospital<br/>
        Shaikpet Rd<br/>
        Hyderabad - 500096<br/>
        +91 77949 21287
      </div>

    </div>

      <div class="title">Session Details </div>

      <table>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Treatment</th>
          <th>Cost</th>
          <th>Physio</th>
        </tr>
    `;
  }

  return row;

}).join("")}

    </table>

  </body>
  </html>
  `;
};