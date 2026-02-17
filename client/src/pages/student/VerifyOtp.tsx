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

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("otpEmail");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/verify-otp", { email, otp });
      localStorage.setItem("studentId", res.data.student.id);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Security Check</h2>
              <p className="text-white/40 text-sm">Enter the code sent to {email}</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10 text-center tracking-[0.5em] font-mono text-lg"
                  placeholder="••••••"
                  maxLength={6}
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
                {loading ? "Verifying..." : "Confirm Identity"}
              </motion.button>

              <div className="text-center">
                <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-white transition-colors">
                  Wrong email? Go Back
                </button>
              </div>

            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
