import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import "./AdminDashboard.css";

// --- Components ---

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

const YearCard = ({ year, count, index }: { year: string; count: number; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0], // Oscillating animation
      }}
      transition={{
        delay: index * 0.1,
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2 // Randomize phase
        }
      }}
      whileHover={{ y: -20, scale: 1.05, boxShadow: "0 20px 40px rgba(66, 133, 244, 0.2)" }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 flex flex-col items-center justify-center text-center group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ion-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <h3 className="text-gray-400 text-sm font-medium tracking-widest mb-4 uppercase z-10">
        {year} Year
      </h3>

      <div className="relative z-10">
        <motion.span
          key={count}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
        >
          {count}
        </motion.span>
      </div>

      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-ion-blue/20 blur-2xl rounded-full group-hover:bg-ion-blue/40 transition-colors duration-500" />
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [years, setYears] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [studentCounts, setStudentCounts] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  // --- Logic ---

  const sendNotification = async () => {
    if (!title || !message) return;
    setSending(true);
    try {
      await api.post("/sendNotification", { title, message, years });
      fetchNotifications();
      // Clear form
      setTitle("");
      setMessage("");
      setYears([]);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setSending(false), 500);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data);
    } catch (e) {
      console.error("Failed to fetch notifications");
    }
  };

  const fetchStudentCounts = async () => {
    try {
      const res = await api.get("/admin/student-count");

      console.log("Student Count API:", res.data); // check this once

      setStudentCounts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to fetch counts");
      setStudentCounts([]);
    }
  };


  useEffect(() => {
    fetchNotifications();
    fetchStudentCounts();
  }, []);

  const toggleYear = (year: string) => {
    setYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const isYearSelected = (year: string) => years.includes(year);

  const getCount = (year: string) => {
    if (!Array.isArray(studentCounts)) return 0;

    const found = studentCounts.find((s: any) => s.year === year);
    return found ? found._count.year : 0;
  };


  const yearOptions = ["FIRST", "SECOND", "THIRD", "FOURTH"];

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/15 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        {[...Array(30)].map((_, i) => <Particle key={i} />)}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">

        {/* --- Header --- */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">On Admin's Control</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">Admin</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Dashboard</span>
          </h1>
          <p className="text-white/40 font-light text-lg">Manage your notification stream in zero-g.</p>
        </motion.header>

        {/* --- Stats Row --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {yearOptions.map((year, i) => (
            <YearCard key={year} year={year} count={getCount(year)} index={i} />
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">

          {/* --- Notification Form (Left Col) --- */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-10"
            >
              <div className="relative group">
                {/* Glow effect behind form */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full block"></span>
                    Broadcast Signal
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter signal title..."
                        className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your transmission..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white/10 resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Target Segments</label>
                      <div className="flex flex-wrap gap-3">
                        {yearOptions.map((y) => (
                          <label key={y} className="cursor-pointer group relative">
                            <input
                              type="checkbox"
                              checked={isYearSelected(y)}
                              onChange={() => toggleYear(y)}
                              className="peer sr-only"
                            />
                            <div className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 peer-checked:bg-purple-500 peer-checked:text-white peer-checked:border-purple-500 transition-all duration-300 hover:bg-white/10 text-sm font-medium">
                              {y}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendNotification}
                      disabled={sending}
                      className={`w-full py-4 mt-4 rounded-xl font-bold text-lg tracking-wide uppercase transition-all shadow-lg text-white
                          ${sending ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 hover:shadow-purple-500/50'}
                        `}
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Transmitting...
                        </span>
                      ) : (
                        "Send Transmission"
                      )}
                    </motion.button>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- History List (Right Col) --- */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-white/80 border-b border-white/10 pb-4">
                Transmission History
              </h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {notifications.map((n, i) => (
                    <motion.div
                      key={n.id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-6 transition-colors duration-300"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-quantum-mint rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-quantum-mint transition-colors">{n.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm">{n.message}</p>
                    </motion.div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-12 text-gray-600 italic">No transmissions recorded.</div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
