// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 8080;

// Database
const db = require("./db.js");

// Routers
const router = require("./routes");
const voteRouter = require("./routes/Votes");
const articleRouter = require("./routes/Articles");
const notificationRouter = require("./routes/Notification"); // ✅ notifications
const answerRouter = require("./routes/Answer"); // ✅ answers

db.connect();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://community-form-eta.vercel.app"
    ],
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// ============================
// Middleware
// ============================
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// ============================
// Routes
// ============================
app.use("/api", router);
app.use("/api/votes", voteRouter);
app.use("/api/articles", articleRouter);
app.use("/api/notifications", notificationRouter); // ✅ mount notifications
app.use("/api/answers", answerRouter); // ✅ mount answers

// ============================
// Socket.IO setup
// ============================
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ============================
// Serve frontend in production
// ============================
if (process.env.NODE_ENV === "production") {
  app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));
  app.use(express.static(path.join(__dirname, "/../frontend/dist")));

  app.get("*", (req, res) => {
    try {
      res.sendFile(path.join(__dirname, "/../frontend/dist/index.html"));
    } catch (error) {
      res.status(500).send("Oops! An unexpected error occurred.");
    }
  });
}

// ============================
// Start Server
// ============================
server.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
