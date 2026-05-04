import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./layout.css";
import {
  FiHome,
  FiUserPlus,
  FiActivity,
  FiFileText,
  FiUsers,
  FiCalendar,
  FiUser,
  FiPhone
} from "react-icons/fi";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

const menu = [
  { name: "Dashboard", path: "/", icon: <FiHome /> },
  { name: "Registration", path: "/registration", icon: <FiUserPlus /> },
  { name: "Treatment", path: "/treatment", icon: <FiActivity /> },
  { name: "Billing", path: "/bill", icon: <FiFileText /> },
  { name: "Admin", path: "/admin", icon: <FiUsers /> },
  { name: "Attendance", path: "/attendance", icon: <FiCalendar /> },
  { name: "Physio", path: "/physio", icon: <FiUser /> },
  { name: "Contact", path: "/contact-dev", icon: <FiPhone /> },
];

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="app">

      {/* MOBILE TOPBAR */}
      <div className="mobile-top">
  <button onClick={() => setOpen(true)}>☰</button>
  <h2>VR Physio Rehab</h2>
</div>
      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo">VR Physio Pvt. Ltd.</div>

        {menu.map((m) => (
  <button
    key={m.path}
    onClick={() => go(m.path)}
    className={location.pathname === m.path ? "active" : ""}
  >
    {m.icon}
    {m.name}
  </button>
))}
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
