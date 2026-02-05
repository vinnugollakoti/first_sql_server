import { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "FIRST",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", form);
      alert(res.data.message);

      localStorage.setItem("otpEmail", form.email);
      navigate("/verify-otp");
    } catch (err: any) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-96"
      >
        <h2 className="text-2xl mb-6 text-accent">Register</h2>

        {/* Full Name */}
        <input
          placeholder="Full Name"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {/* College */}
        <input
          placeholder="College"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, college: e.target.value })
          }
        />

        {/* Year Dropdown */}
        <select
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value })
          }
        >
          <option value="FIRST">FIRST</option>
          <option value="SECOND">SECOND</option>
          <option value="THIRD">THIRD</option>
          <option value="FOURTH">FOURTH</option>
        </select>

        <button className="w-full bg-accent py-2 rounded mt-4">
          Register
        </button>

        <Link
          to="/"
          className="block mt-4 text-sm text-gray-400 hover:text-white"
        >
          Have an account ?
        </Link>
        <Link to="/admin">Are you a admin ?</Link>
      </form>
    </div>
  );
}
