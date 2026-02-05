import { BrowserRouter,Routes,Route } from "react-router-dom";

import Register from "../pages/student/Register";
import Login from "../pages/student/Login";
import VerifyOtp from "../pages/student/VerifyOtp";
import Dashboard from "../pages/student/Dashboard";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-otp" element={<VerifyOtp/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}
