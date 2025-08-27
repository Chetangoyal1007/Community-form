import React from "react";

export default function Tasks() {
  const tasks = [
    { id: 1, task: "Finish React project", status: "In Progress" },
    { id: 2, task: "Prepare presentation slides", status: "Pending" },
    { id: 3, task: "Read AI research paper", status: "Completed" },
  ];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Your Tasks</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              background: "#f1f1f1",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{t.task}</span>
            <span
              style={{
                color:
                  t.status === "Completed"
                    ? "green"
                    : t.status === "Pending"
                    ? "red"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {t.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
