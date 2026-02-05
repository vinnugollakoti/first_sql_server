import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/${studentId}/getnotifications`);
      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">

      {/* ---------- Student Profile Card ---------- */}
      <div className="bg-zinc-900 p-6 rounded-xl mb-8">
        <h2 className="text-2xl text-accent mb-4">
          Student Details
        </h2>

        <div className="space-y-2">
          <p><strong>Name:</strong> {data.student.fullName}</p>
          <p><strong>Email:</strong> {data.student.email}</p>
          <p><strong>Phone:</strong> {data.student.phone}</p>
          <p><strong>College:</strong> {data.student.college}</p>
          <p><strong>Year:</strong> {data.student.year}</p>
        </div>
      </div>

      {/* ---------- Notifications ---------- */}
      <h2 className="text-2xl text-accent mb-4">
        Notifications
      </h2>

      {data.notifications.length === 0 && (
        <p>No notifications yet</p>
      )}

      {data.notifications.map((n: any) => (
        <div
          key={n.id}
          className="bg-zinc-900 p-4 rounded mb-3"
        >
          <h3 className="text-xl">{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
