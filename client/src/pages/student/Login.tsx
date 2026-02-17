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

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/login", { email });
      localStorage.setItem("otpEmail", email);
      navigate("/verify-otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        {[...Array(20)].map((_, i) => <Particle key={i} />)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
              <p className="text-white/40 text-sm">Enter your email to receive a transformative OTP</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-lg text-white
                        ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/40'}
                      `}
              >
                {loading ? "Sending Signal..." : "Send OTP"}
              </motion.button>

              <div className="pt-4 text-center space-y-3">
                <Link to="/register" className="block text-sm text-gray-400 hover:text-white transition-colors">
                  Don't have an account? <span className="text-purple-400">Register</span>
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
