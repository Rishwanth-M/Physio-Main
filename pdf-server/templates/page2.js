const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "../assets/logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

function header() {
  return `
  <div class="header">

    <div class="logo-box">
      <img src="data:image/png;base64,${logoBase64}" />
    </div>

    <div class="center-box">
      <div class="clinic-name">VR Physio Rehab Pvt. Ltd.</div>
      <div class="doctor-name">Dr. Venkat R Manda PT</div>
      <div class="doctor-sub">
        M.P.T Ortho | M.I.A.P<br/>
        Ph.D (Ortho)
      </div>
      <div class="director">Director, VR Physio Rehab Pvt. Ltd.</div>
    </div>

    <div class="right-box">
      VR Physio Rehab<br/>
      Aditya Ellen Plaza<br/>
      Femcity Hospital<br/>
      Shaikpet Rd<br/>
      Hyderabad - 500096<br/><br/>
      +91 77949 21287<br/>
      vrphysiorehab.com
    </div>

  </div>

  <div class="header-line"></div>
  `;
}



function page2() {
  return `

    ${header()}

    <div class="section">CLINIC POLICY</div>

    <div class="para">
      <b>Our vision:</b><br/>
      “To provide exceptional physiotherapy and healthcare services, where patient care and customer service is of the highest quality and integral to our practice. We strive to maintain our reputation as the leaders in “hands-on” physiotherapy and exercise rehabilitation, and enjoy working with patients in a friendly and relaxed environment, based on empathy and individual care.”
    </div>

    <div class="para">
      <b>We promise to:</b><br/>
      ✓ Always be on time as we understand your time is as precious as ours.<br/>
      ✓ Commit to excellence in physiotherapy. Our physiotherapists are consistently improving their clinical skills with regular attendance at professional development seminars.<br/>
      ✓ Be open in our communication. We promise to provide outstanding healthcare, give clear guidance and refer to a specialist if necessary.<br/>
      ✓ Respect your privacy. All patient information is kept securely and only released to third parties upon written permission from the patient.
    </div>

    <div class="para">
      <b>We expect you to:</b><br/>
      ✓ Arrive on time. Delays may reduce treatment duration.<br/>
✓ Missed appointments without 24-hour notice may incur a full consultation fee.<br/>
✓ Repeated cancellations may result in discharge from care.<br/>
✓ Referrals are appreciated as a sign of satisfaction.<br/>
✓ Feedback helps us improve our services.
</div>

    <div class="para">
      We want you to get the most from your care at VR Physio Rehab Pvt. Ltd.
    </div>

    <div class="signature-block">
      <div>Name: ________________________________</div>
      <div class="agree-text">I have read and understand the above Clinic Policy.</div>
    </div>

    <div class="section">INFORMED CONSENT</div>

    <div class="para">
      I consent to assessment and treatment by VR Physio Rehab Pvt. Ltd. in accordance with professional guidelines. This may include manual therapy, mobilisation, massage, acupuncture and electrotherapy.

I understand the risks will be explained prior to treatment and I may decline any procedure at any time.

All physiotherapists operate under individual professional insurance, and liability remains between patient and treating therapist.

By signing, I agree to the above terms.
    </div>

    <div class="sign-row">
      <div>Signed: __________________________</div>
      <div>Date: __________________________</div>
    </div>

  `;
}

module.exports = page2;