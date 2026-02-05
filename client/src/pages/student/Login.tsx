import { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await api.post("/login", { email });

      localStorage.setItem("otpEmail", email);
      navigate("/verify-otp");
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-6 text-accent">Student Login</h2>

        <input
          className="w-full p-2 bg-black border border-gray-700 rounded mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-accent py-2 rounded"
        >
          Send OTP
        </button>
        <Link to="/register">Dont have an account ?</Link>
        <Link to="/admin">Are you a admin ?</Link>
      </div>
    </div>
  );
}
