import { useState,useEffect } from "react";
import api from "../../services/api";

export default function AdminDashboard(){

  const [title,setTitle] = useState("");
  const [message,setMessage] = useState("");
  const [years,setYears] = useState<string[]>([]);
  const [notifications,setNotifications] = useState<any[]>([]);
  const [studentCounts,setStudentCounts] = useState<any[]>([]);

  const sendNotification = async () => {
    await api.post("/sendNotification",{title,message,years});
    fetchNotifications();
  };

  const fetchNotifications = async () => {
    const res = await api.get("/admin/notifications");
    setNotifications(res.data);
  };

  const fetchStudentCounts = async () => {
    const res = await api.get("/admin/student-count");
    setStudentCounts(res.data);
  };

  useEffect(()=>{
    fetchNotifications();
    fetchStudentCounts();
  },[]);

  const toggleYear = (year:string)=>{
    setYears(prev =>
      prev.includes(year)
      ? prev.filter(y=>y!==year)
      : [...prev,year]
    );
  };

  const getCount = (year:string)=>{
    const found = studentCounts.find((s:any)=>s.year === year);
    return found ? found._count.year : 0;
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl text-accent mb-6">
        Admin Dashboard
      </h1>

      {/* ---------- Student Stats ---------- */}
      <div className="grid grid-cols-4 gap-4 mb-10">

        {["FIRST","SECOND","THIRD","FOURTH"].map(year => (
          <div
            key={year}
            className="bg-zinc-900 p-5 rounded-xl text-center"
          >
            <h3 className="text-lg">{year} Year</h3>
            <p className="text-3xl text-accent font-bold">
              {getCount(year)}
            </p>
          </div>
        ))}

      </div>

      {/* ---------- Send Notification ---------- */}

      <input
        placeholder="Title"
        onChange={e=>setTitle(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Message"
        onChange={e=>setMessage(e.target.value)}
        className="input"
      />

      <div className="flex gap-4 mt-3">
        {["FIRST","SECOND","THIRD","FOURTH"].map(y=>(
          <label key={y}>
            <input type="checkbox" onChange={()=>toggleYear(y)}/> {y}
          </label>
        ))}
      </div>

      <button
        onClick={sendNotification}
        className="btn mt-4"
      >
        Send Notification
      </button>

      {/* ---------- Notification List ---------- */}

      <h2 className="mt-10 text-xl">
        All Notifications
      </h2>

      {notifications.map(n=>(
        <div key={n.id} className="bg-zinc-900 p-4 rounded mt-3">
          <h3>{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
