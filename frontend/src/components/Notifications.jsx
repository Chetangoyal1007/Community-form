

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://community-form-backend.onrender.com";

const socket = io(BACKEND_URL, { transports: ["websocket"] });

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null); // ✅ fix

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/notifications`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else if (Array.isArray(res.data.notifications)) {
          setNotifications(res.data.notifications);
        }
      })
      .catch((err) => console.error("Error fetching notifications:", err));

    socket.on("notification", (data) =>
      setNotifications((prev) => [{ ...data, isRead: false }, ...prev])
    );

    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollArrow(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getTypeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case "ANSWER":
        return { color: "#28a745", bg: "#e9f9ee", icon: "✅" };
      case "QUESTION":
        return { color: "#007bff", bg: "#eef5ff", icon: "❓" };
      case "SYSTEM":
        return { color: "#ff8c00", bg: "#fff5eb", icon: "⚙️" };
      default:
        return { color: "#d25f5fff", bg: "#f5f5f5", icon: "ℹ️" };
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
        🔔 Notifications
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {notifications.length === 0 && (
          <p style={{ color: "#777" }}>No notifications yet.</p>
        )}

        {notifications.map((n, i) => {
          const style = getTypeStyle(n.type);
          const isHovered = hoveredIndex === i; // ✅ track hover

          return (
            <div
              key={n._id || i}
              style={{
                background: n.isRead ? "#fff" : style.bg,
                borderRadius: "14px",
                padding: "16px 20px",
                boxShadow: isHovered
                  ? "0 6px 14px rgba(0,0,0,0.18)"
                  : n.isRead
                  ? "0 2px 6px rgba(0,0,0,0.08)"
                  : "0 4px 12px rgba(0,0,0,0.15)",
                borderLeft: `6px solid ${style.color}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
              onClick={() => markAsRead(n._id || i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: style.color,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                <span>{style.icon}</span>
                {n.type?.toUpperCase() || "INFO"}
              </div>

              <div style={{ fontSize: "16px", marginBottom: "6px" }}>
                {n.message}
              </div>

              <small style={{ color: "#666", fontSize: "13px" }}>
                {new Date(n.timestamp || n.createdAt).toLocaleString()}
              </small>
            </div>
          );
        })}
      </div>

      {showScrollArrow && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "linear-gradient(135deg, #6C63FF, #007bff)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: 0.85,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ⬆
        </button>
      )}
    </div>
  );
}
