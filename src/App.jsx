import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import Dashboard from "./pages/dashboard/Dashboard";
import Registration from "./pages/registration/Registration";
import Treatment from "./pages/treatment/Treatment";
import Bill from "./pages/bill/Bill";
import Admin from "./pages/admin/Admin";
import Attendance from "./pages/attendance/Attendance";
import Physio from "./pages/doctors/Physio";
import ContactDev from "./pages/contact/ContactDev";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="registration" element={<Registration />} />
        <Route path="treatment" element={<Treatment />} />
        <Route path="bill" element={<Bill />} />
        <Route path="admin" element={<Admin />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="physio" element={<Physio />} />
        <Route path="contact-dev" element={<ContactDev />} />
      </Route>
    </Routes>
  );
}