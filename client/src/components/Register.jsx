import { useState } from "react";
import { api } from "../api/api";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "FIRST",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await api.post("/register", form);
    alert("Registration successful. Please login.");
  };

  return (
    <div className="auth-box">
      <h2>Student Register</h2>

      <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <input
        name="college"
        placeholder="College"
        onChange={handleChange}
      />

      <select name="year" onChange={handleChange}>
        <option value="FIRST">First Year</option>
        <option value="SECOND">Second Year</option>
        <option value="THIRD">Third Year</option>
        <option value="FOURTH">Fourth Year</option>
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}
