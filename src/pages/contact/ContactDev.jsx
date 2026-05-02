import "./contact.css";

export default function Support() {
  return (
    <div className="support-container">

      <div className="support-card">

        <h1>Need Help?</h1>
        <p className="subtitle">
          Facing an issue? I’m here to help you quickly and efficiently.
        </p>

        {/* ISSUE TYPES */}
        <div className="issues-grid">

          <div className="issue-box">
            <h3>🔐 Login Issues</h3>
            <p>Problems signing in or authentication errors</p>
          </div>

          <div className="issue-box">
            <h3>📊 Data / Records</h3>
            <p>Patient data not showing or incorrect entries</p>
          </div>

          <div className="issue-box">
            <h3>⚙️ Technical Bugs</h3>
            <p>App crashes, errors, or unexpected behavior</p>
          </div>

          <div className="issue-box">
            <h3>💳 Billing / Cost</h3>
            <p>Session cost or payment-related queries</p>
          </div>

        </div>

        {/* CONTACT OPTIONS */}
        <div className="contact-section">

          <h2>Contact Me Directly</h2>

          <div className="contact-options">

            <a href="mailto:mekalarishwanthkumar26@gmail.com" className="contact-btn">
              📧 Email Support
            </a>

            <a href="tel:+919182068791" className="contact-btn">
              📞 Call Now
            </a>

            <a
              href="https://wa.me/919182068791"
              target="_blank"
              rel="noreferrer"
              className="contact-btn whatsapp"
            >
              💬 WhatsApp Chat
            </a>

          </div>
        </div>

        {/* NOTE */}
        <div className="note">
          <p>
            ⏱ Response time: Usually within 1–3 hours during working time.
          </p>
        </div>

      </div>
    </div>
  );
}