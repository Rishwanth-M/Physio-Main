const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "../assets/logo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN");

function numberToWords(num) {
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];

  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if ((num = num.toString()).length > 9) return "Overflow";

  const n = ("000000000" + num).substr(-9).match(/.{1,2}/g);

  let str = "";

  const numWords = (n) => {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + " " + a[n % 10];
  };

  if (n[0] != 0) str += numWords(n[0]) + " Crore ";
  if (n[1] != 0) str += numWords(n[1]) + " Lakh ";
  if (n[2] != 0) str += numWords(n[2]) + " Thousand ";
  if (n[3] != 0) str += numWords(n[3]) + " Hundred ";
  if (n[4] != 0) str += numWords(n[4]);

  return str.trim() + " Rupees Only";
}

module.exports = function generateBillHTML({
  patient,
  sessions,
  totalCost
}) {

  const d = patient.data || {};
  const costPerSession = sessions[0]?.cost || 0;

  const invoiceNo = patient.patient_id.replace("VR", "");

  return `
  <html>
  <head>
    <style>

      body {
        font-family: Arial;
        margin: 40px;
      }

      .title {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      table, td, th {
        border: 1px solid #000;
      }

      td, th {
        padding: 8px;
      }

      .header-box {
        display: flex;
        align-items: center;
        border: 1px solid #000;
        padding: 10px;
      }

      .logo {
        height: 60px;
        margin-right: 10px;
      }

      .clinic {
        font-size: 20px;
        font-weight: bold;
      }

      .right {
        text-align: right;
      }

      .no-border td {
        border: none;
      }

      .bold {
        font-weight: bold;
      }

      .sign {
        margin-top: 40px;
        text-align: right;
      }

    </style>
  </head>

  <body>

    <div class="title">BILL RECEIPT</div>

    <!-- HEADER -->
    <div class="header-box">

  <img src="data:image/png;base64,${logoBase64}" class="logo"/>

  <div style="flex:1; text-align:center;">
    <div class="clinic">VR PHYSIO REHAB PVT LTD.</div>
    <div>Dr. Venkat R Manda PT</div>
    <div>M.P.T Ortho | M.I.A.P | Ph.D (Ortho)</div>
    <div>Director</div>
  </div>

  <div style="text-align:right; font-size:12px;">
    VR Physio Rehab<br/>
    Aditya Ellen Plaza<br/>
    Femcity Hospital<br/>
    Shaikpet Rd<br/>
    Hyderabad - 500096<br/>
    +91 77949 21287<br/>
    vrphysiorehab@gmail.com
  </div>

</div>

    <!-- BILL + INVOICE -->
    <table>
  <tr>
    <td>
      <b>Bill To:</b><br/><br/>
      ${patient.name}<br/><br/>
      ${d.address || ""}<br/><br/>
      Contact: ${patient.phone}
    </td>

    <td>
      <b>Invoice Details:</b><br/><br/>
      No: ${invoiceNo}<br/><br/>
      Date: ${formatDate(new Date())}
    </td>
  </tr>
</table>

    <!-- SERVICE -->
    <table>
      <tr>
        <th>#</th>
        <th>Service Name</th>
        <th>Price / Unit</th>
        <th>Amount</th>
      </tr>

      <tr>
        <td>1</td>
        <td>
          ${d.diagnosedWith || patient.diagnosed_with}<br/>
          <small>(${sessions.length} Sessions)</small>
        </td>
        <td>₹${costPerSession}</td>
        <td>₹${totalCost}</td>
      </tr>

      <tr>
        <td colspan="3" class="bold">Total</td>
        <td class="bold">₹${totalCost}</td>
      </tr>
    </table>

    <!-- SUMMARY -->
    <table>
  <tr>
    <td>Sub Total</td>
    <td class="right">₹${totalCost}</td>
  </tr>

  <tr>
    <td>Total</td>
    <td class="right bold">₹${totalCost}</td>
  </tr>

  <tr>
    <td colspan="2"><b>Invoice Amount in Words:</b></td>
  </tr>

  <tr>
    <td colspan="2">${numberToWords(totalCost)}</td>
  </tr>

  <tr>
    <td>Received</td>
    <td class="right">₹${totalCost}</td>
  </tr>

  <tr>
    <td>Balance</td>
    <td class="right">₹0</td>
  </tr>

</table>

    <!-- TERMS -->
    <table>
  <tr>
    <td style="font-size:12px; line-height:1.0;">
      <b>Terms & Conditions:</b><br/><br/>

      • This receipt is issued for physiotherapy services and is valid for insurance/reimbursement with valid medical records.<br/>
      • Healthcare services provided are exempt from GST under applicable government laws.<br/>
      • No GST has been charged on this bill.<br/>
      • All payments are non-refundable and non-transferable.<br/>
      • Kindly retain this receipt for future reference and claims.<br/>
      • Subject to Hyderabad jurisdiction.
    </td>
  </tr>
</table>
<br/><br/><br/><br/><br/>
    <!-- SIGN -->
    <div class="sign">
      <b>Authorized Signatory</b>
    </div>

  </body>
  </html>
  `;
};