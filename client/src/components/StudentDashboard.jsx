import { useEffect, useState } from "react";
import { api } from "../api/api";
import "../styles/dashboard.css";

export default function StudentDashboard({ student }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get(`/${student.id}/getnotifications`)
      .then(res => setNotifications(res.data.notifications));
  }, []);

  return (
    <div>
      <h2>Welcome {student.fullName}</h2>
      {notifications.map(n => (
        <div key={n.id} className="card">
          <h4>{n.title}</h4>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
