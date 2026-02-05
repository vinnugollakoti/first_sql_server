import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("otpEmail");

  const verify = async () => {
    try {
      const res = await api.post("/verify-otp", { email, otp });

      localStorage.setItem("studentId", res.data.student.id);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h2 className="text-xl mb-6 text-accent">Verify OTP</h2>

        <input
          className="w-full p-2 bg-black border border-gray-700 rounded mb-4"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verify}
          className="w-full bg-accent py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
