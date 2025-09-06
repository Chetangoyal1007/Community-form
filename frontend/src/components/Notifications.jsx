import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://community-form-backend.onrender.com";

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
});

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch existing notifications
    axios
      .get(`${BACKEND_URL}/api/notifications`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));

    // Live notifications
    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("notification", (data) => setNotifications((prev) => [data, ...prev]));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>🔔 Notifications</h2>

      {notifications.length === 0 && <p style={{ color: "#777" }}>No notifications yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((n, i) => (
          <li
            key={n._id || i}
            style={{
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderLeft: "5px solid #007bff",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#007bff", marginBottom: "5px" }}>
              {n.type?.toUpperCase()}
            </div>
            <div style={{ marginBottom: "5px" }}>{n.message}</div>
            <small style={{ color: "#555" }}>
              {new Date(n.timestamp || n.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
