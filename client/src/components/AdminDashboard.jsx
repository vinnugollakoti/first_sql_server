import { useEffect, useState } from "react";
import { api } from "../api/api";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [year, setYear] = useState("FIRST");
  const [notifications, setNotifications] = useState([]);

  const send = async () => {
    await api.post("/sendNotification", {
      title,
      message,
      years: [year],
    });
    fetchNotifications();
  };

  const fetchNotifications = async (y) => {
    const res = await api.get(`/admin/notifications${y ? `?year=${y}` : ""}`);
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Send Notification</h2>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Message" onChange={e => setMessage(e.target.value)} />
      <select onChange={e => setYear(e.target.value)}>
        <option>FIRST</option>
        <option>SECOND</option>
        <option>THIRD</option>
        <option>FOURTH</option>
      </select>
      <button onClick={send}>Send</button>

      <h3>All Notifications</h3>
      {notifications.map(n => (
        <div key={n.id} className="card">
          <h4>{n.title}</h4>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
