import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";

const Particle = () => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const duration = Math.random() * 10 + 10;

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
      }}
      animate={{
        y: [0, -50, 0],
        x: [0, Math.random() * 30 - 15, 0],
        opacity: [0.1, 0.4, 0.1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "FIRST",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/register", form);
      // alert(res.data.message); // Replaced with UI feedback

      localStorage.setItem("otpEmail", form.email);
      navigate("/verify-otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        {[...Array(25)].map((_, i) => <Particle key={i} />)}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg px-6 py-12"
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Join the Network</h2>
              <p className="text-white/40 text-sm">Create your student profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Full Name</label>
                  <input
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10"
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Year</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white outline-none transition-all duration-300 hover:bg-white/10"
                      value={form.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                    >
                      <option value="FIRST" className="bg-[#0a0a0a]">First Year</option>
                      <option value="SECOND" className="bg-[#0a0a0a]">Second Year</option>
                      <option value="THIRD" className="bg-[#0a0a0a]">Third Year</option>
                      <option value="FOURTH" className="bg-[#0a0a0a]">Fourth Year</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10"
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10"
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">College Name</label>
                <input
                  type="text"
                  required
                  placeholder="University of Technology"
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10"
                  onChange={(e) => handleChange("college", e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-2">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-lg text-white mt-4
                        ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/40'}
                      `}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </motion.button>

              <div className="pt-4 text-center space-y-3">
                <Link to="/" className="block text-sm text-gray-400 hover:text-white transition-colors">
                  Already registered? <span className="text-purple-400">Login</span>
                </Link>
                <Link to="/admin" className="block text-xs text-gray-500 hover:text-purple-400 transition-colors uppercase tracking-widest">
                  Admin Access
                </Link>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
