const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "../assets/logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

const pdfCSS = fs.readFileSync(
  path.join(__dirname, "pdf.css"),
  "utf-8"
);



function generatePatientHTML(data) {

  const fullName = `${data.title || ""} ${data.surname || ""} ${data.firstName || ""} ${data.middleName || ""}`.replace(/\s+/g, " ").trim();

  return `
  
      <!-- HEADER -->
      <div class="header">

  <!-- LEFT: LOGO -->
  <div class="logo-box">
    <img src="data:image/png;base64,${logoBase64}" />
  </div>

  <!-- CENTER: CLINIC + DOCTOR -->
  <div class="center-box">
    <div class="clinic-name">VR Physio Rehab Pvt. Ltd.</div>
    
    <div class="doctor-name">Dr. Venkat R Manda PT</div>

    <div class="doctor-sub">
      M.P.T Ortho | M.I.A.P<br/>
      Ph.D (Ortho)
    </div>

    <div class="director">
      Director, VR Physio Rehab Pvt. Ltd.
    </div>
  </div>

  <!-- RIGHT: CONTACT -->
  <div class="right-box">
    <div>VR Physio Rehab</div>
    <div>Aditya Ellen Plaza</div>
    <div>Femcity Hospital, Shaikpet Rd</div>
    <div>Hyderabad - 500096</div>

    <div class="spacer"></div>

    <div> +91 77949 21287</div>
    <div> vrphysiorehab.com</div>
  </div>

</div>

<div class="header-line"></div>

      <div class="title">PATIENT REGISTRATION FORM</div>

      <div class="meta">
        <div><b>Patient ID:</b> ${data.patientId}</div>
        <div><b>Date:</b> ${new Date().toLocaleDateString()}</div>
      </div>

      <!-- ================= SECTION ================= -->
      <div class="section">PATIENT INFORMATION</div>

      <div class="row">
        <div class="field"><label>Name</label><div class="line">${fullName}</div></div>
        <div class="field"><label>Gender</label><div class="line">${data.gender || ""}</div></div>
      </div>

      <div class="row">
        <div class="field"><label>Date of Birth</label><div class="line">${data.dob || ""}</div></div>
        <div class="field"><label>Age</label><div class="line">${data.age || ""}</div></div>
      </div>

      <div class="row full">
        <div class="field full"><label>Address</label><div class="line">${data.address || ""}</div></div>
      </div>

      <div class="row">
        <div class="field"><label>District</label><div class="line">${data.district || ""}</div></div>
        <div class="field"><label>State</label><div class="line">${data.state || ""}</div></div>
        <div class="field"><label>Postal Code</label><div class="line">${data.postalCode || ""}</div></div>
      </div>

      <div class="row">
        <div class="field"><label>Mobile</label><div class="line">${data.mobile || ""}</div></div>
        <div class="field"><label>Email</label><div class="line">${data.email || ""}</div></div>
      </div>

      <div class="row">
        <div class="field"><label>Father Name</label><div class="line">${data.fatherName || ""}</div></div>
        <div class="field"><label>Father Occupation</label><div class="line">${data.fatherOccupation || ""}</div></div>
      </div>

      <div class="row">
        <div class="field"><label>Father Mobile</label><div class="line">${data.fatherMobile || ""}</div></div>
        <div class="field"><label>Diagnosed With</label><div class="line">${data.diagnosedWith || ""}</div></div>
      </div>

      <div class="row">
        <div class="field">
          <label>Insurance</label>
          <div class="line">${data.insurance || ""} ${data.insurance === "Yes" ? "- " + (data.insuranceDetails || "") : ""}</div>
        </div>
      </div>

      <!-- ================= SECTION ================= -->
      <div class="section">REFERRAL INFORMATION</div>

      <div class="row">
        <div class="field"><label>Referral Type</label><div class="line">${data.referral || ""}</div></div>
        <div class="field"><label>Doctor Name</label><div class="line">${data.doctorRef || ""}</div></div>
      </div>

      <div class="row">
        <div class="field"><label>Gym Member</label><div class="line">${data.gym || ""}</div></div>
        <div class="field"><label>Gym Name</label><div class="line">${data.gymName || ""}</div></div>
      </div>

      <!-- ================= SECTION ================= -->
      <div class="section">MEDICAL HISTORY</div>

      <div class="textarea">${data.medicalHistory || ""}</div>

      <!-- ================= SECTION ================= -->
      <div class="section">EMERGENCY CONTACT</div>

      <div class="row">
        <div class="field"><label>Name</label><div class="line">${data.emergencyName || ""}</div></div>
        <div class="field"><label>Relation</label><div class="line">${data.relationship || ""}</div></div>
        <div class="field"><label>Phone</label><div class="line">${data.emergencyPhone || ""}</div></div>
      </div>
      

  `;
}

module.exports = generatePatientHTML;