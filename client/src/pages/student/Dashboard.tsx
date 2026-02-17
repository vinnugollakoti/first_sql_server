import { useEffect, useState } from "react";
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

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/${studentId}/getnotifications`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-purple-400 font-mono tracking-widest text-sm uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white overflow-x-hidden font-sans">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        {[...Array(30)].map((_, i) => <Particle key={i} />)}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-start border-b border-white/10 pb-8"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">Student Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">{data.student.fullName}</span>
          </h1>
          <p className="text-white/40 mt-2 text-lg">Your academic signal feed is active.</p>
        </motion.header>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* --- Left Column: Profile --- */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-10"
            >
              <div className="relative group">
                {/* Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {data.student.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Profile Card</h3>
                      <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Active</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ProfileItem label="Email" value={data.student.email} />
                    <ProfileItem label="Phone" value={data.student.phone} />
                    <ProfileItem label="College" value={data.student.college} />
                    <ProfileItem label="Year" value={data.student.year} highlight />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- Right Column: Notifications --- */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full block" />
                Incoming Transmissions
              </h2>

              {data.notifications.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <p className="text-white/40 italic">No signals received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.notifications.map((n: any, i: number) => (
                    <motion.div
                      key={n.id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i + 0.3 }}
                      className="group relative bg-[#0a0a0a] hover:bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30"
                    >
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full opacity-50 group-hover:opacity-100 transition-opacity" />

                      <div className="pl-4">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{n.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{n.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

const ProfileItem = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div className="group">
    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">{label}</p>
    <p className={`font-medium transition-colors ${highlight ? 'text-purple-400 font-bold' : 'text-gray-300 group-hover:text-white'}`}>
      {value}
    </p>
  </div>
);
