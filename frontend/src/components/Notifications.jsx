import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://community-form-backend.onrender.com";

const socket = io(BACKEND_URL, {
  transports: ["websocket"], // 👈 force websocket
});

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // ✅ Fetch existing notifications from DB on mount
    axios
      .get(`${BACKEND_URL}/api/notifications`)
      .then((res) => {
        setNotifications(res.data); // they’re already sorted in backend
      })
      .catch((err) => console.error("❌ Error fetching notifications:", err));

    // ✅ Listen for live notifications
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.on("notification", (data) => {
      console.log("📩 New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔔 Notifications</h2>
      <ul>
        {notifications.map((n, i) => (
          <li key={n._id || i}>
            <strong>{n.type?.toUpperCase()}</strong>: {n.message}
            <br />
            <small>
              {new Date(n.timestamp || n.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
