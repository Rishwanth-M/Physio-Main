import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Registration", path: "/registration" },
    { name: "Treatment", path: "/treatment" },
    { name: "Billing", path: "/bill" },
    { name: "Admin", path: "/admin" },
    { name: "Attendance", path: "/attendance" },
    { name: "Physio", path: "/physio" },
    { name: "Contact", path: "/contact-dev" },
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
        <h2>VR Physio</h2>
      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo">VR</div>

        {menu.map((m) => (
          <button
            key={m.path}
            onClick={() => go(m.path)}
            className={location.pathname === m.path ? "active" : ""}
          >
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