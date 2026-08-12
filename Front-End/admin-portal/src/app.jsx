import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import Notifications from "./pages/Notifications";
import Signup from "./pages/Signup";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import DepartmentComplaints from "./pages/DepartmentComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminDepartments from "./pages/AdminDepartments";
import AdminCitizens from "./pages/AdminCitizens";
import AdminReports from "./pages/AdminReports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/complaints"
  element={<AdminComplaints />}
/>

<Route
  path="/admin/departments"
  element={<AdminDepartments />}
/>

<Route
  path="/admin/citizens"
  element={<AdminCitizens />}
/>

<Route
  path="/admin/reports"
  element={<AdminReports />}
/>

        <Route
          path="/citizen/dashboard"
          element={<CitizenDashboard />}
        />

        <Route
          path="/citizen/submit-complaint"
          element={<SubmitComplaint />}
        />

        <Route
  path="/department/complaints"
  element={<DepartmentComplaints />}
/>

        <Route
  path="/department/dashboard"
  element={<DepartmentDashboard />}
/>

        <Route
          path="/citizen/complaints"
          element={<MyComplaints />}
        />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/citizen/notifications"
          element={<Notifications />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;