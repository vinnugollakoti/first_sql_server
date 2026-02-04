import { useState } from "react";
import { api } from "../api/api";
import "../styles/auth.css";

export default function StudentLogin({ onOtp }) {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await api.post("/login", { email });
    onOtp(email);
  };

  return (
    <div className="auth-box">
      <h2>Student Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={submit}>Send OTP</button>
    </div>
  );
}
