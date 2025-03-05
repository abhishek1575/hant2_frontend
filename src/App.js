import { Route, Routes, Navigate, } from "react-router-dom";
import "./App.css";
import Login from "./Component/Login/Login";
import Dashboard2 from "./Component/Admin/dashboard/Dashboard2";
import ForgotPassword from "./Component/Login/ForgotPassword";
import UserDashboard from "./Component/User/UserDashboaard";
import SuperAdminDashboard from "./Component/SuperAdmin/SuperAdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* admin path */}
      <Route path="/adashboard" element={<Dashboard2 role="ADMIN" />} />

      {/*super admin path */}
      <Route
        path="/sdashboard"
        element={<SuperAdminDashboard role="SUPER_ADMIN" />}
      />

      <Route path="/udashboard" element={<UserDashboard role="USER" />} />
    </Routes>
    
  );
}

export default App;
