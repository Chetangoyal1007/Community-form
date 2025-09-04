import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://community-form-backend.onrender.com"); // backend URL

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔔 Notifications</h2>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>
            <strong>{n.type.toUpperCase()}</strong>: {n.message} <br />
            <small>{new Date(n.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
