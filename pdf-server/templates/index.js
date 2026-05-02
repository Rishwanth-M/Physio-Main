const fs = require("fs");
const path = require("path");

const page1 = require("./page1");
const page2 = require("./page2");

const pdfCSS = fs.readFileSync(
  path.join(__dirname, "./pdf.css"),
  "utf-8"
);

function footer(page, isLast = false) {
  return `
  <div class="footer">
    <div>
  ${isLast 
    ? "Please submit this completed form to your physiotherapist (T&C apply)." 
    : "Please submit this completed form to your physiotherapist."
  }
</div>
    <div>${page}</div>
  </div>
  `;
}

function generateHTML(data) {
  return `
  <html>
    <head>
      <style>${pdfCSS}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    </head>

<body>

  <div class="page page-1">
    ${page1(data)}
    ${footer(1, false)}
  </div>

<div style="page-break-before: always;"></div>  <!-- 🔥 FIX -->

  <div class="page page-2">
    ${page2(data)}
    ${footer(2, true)}
  </div>

</body>
  </html>
  `;
}

module.exports = generateHTML;