import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    const res = await api.post("/admin-login",{email,password});
    localStorage.setItem("adminId",res.data.adminId);
    navigate("/admin-dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h2 className="text-2xl text-accent mb-6">Admin Login</h2>

        <input onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input"/>
        <input onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="input"/>

        <button onClick={login} className="btn">Login</button>
      </div>
    </div>
  );
}
