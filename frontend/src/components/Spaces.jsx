import React from "react";

export default function Spaces() {
  const spaces = [
    { id: 1, name: "Technology", description: "Latest trends in tech and AI." },
    { id: 2, name: "Science", description: "Discoveries and research in science." },
    { id: 3, name: "Lifestyle", description: "Discussions on health, fitness, and daily life." },
  ];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Your Spaces</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {spaces.map((space) => (
          <li
            key={space.id}
            style={{
              background: "#f8f8f8",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            <h3>{space.name}</h3>
            <p>{space.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
