import "./dashboard.css";
import logo from "../../assets/logo.png";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="center-box">
        <img src={logo} alt="VR Physio Logo" className="logo-img" />
        <h1>VR Physio Rehab Pvt. Ltd.</h1>
      </div>
    </div>
  );
}