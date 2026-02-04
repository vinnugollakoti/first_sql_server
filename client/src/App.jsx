import { useState } from "react";
import StudentLogin from "./components/StudentLogin";
import Register from "./components/Register";
import OtpVerify from "./components/OtpVerify";
import StudentDashboard from "./components/StudentDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [email, setEmail] = useState(null);
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (admin) return <AdminDashboard />;
  if (student) return <StudentDashboard student={student} />;
  if (email) return <OtpVerify email={email} onLogin={setStudent} />;

  return (
    <>
      {showRegister ? <Register /> : <StudentLogin onOtp={setEmail} />}

      <button onClick={() => setShowRegister(!showRegister)}>
        {showRegister ? "Back to Login" : "New Student? Register"}
      </button>

      <AdminLogin onLogin={() => setAdmin(true)} />
    </>
  );
}
