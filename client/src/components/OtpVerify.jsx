import { useState } from "react";
import { api } from "../api/api";

export default function OtpVerify({ email, onLogin }) {
  const [otp, setOtp] = useState("");

  const verify = async () => {
    const res = await api.post("/verify-otp", { email, otp });
    onLogin(res.data.student);
  };

  return (
    <div className="auth-box">
      <h2>Verify OTP</h2>
      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <button onClick={verify}>Verify</button>
    </div>
  );
}
