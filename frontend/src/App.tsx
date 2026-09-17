import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import ServicesPage from "./pages/ServicePage";
import AppointmentsPage from "./pages/AppointmentPage";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium rounded-md ${
    isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

function App() {
  return (
    <BrowserRouter>
      <nav className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto">
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/appointments" className={navLinkClass}>
            Appointments
          </NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<AppointmentsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;