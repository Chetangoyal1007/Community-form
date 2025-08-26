const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 8080;

// Database
const db = require("./db.js");

// Routers
const router = require("./routes");        // main API routes
const voteRouter = require("./routes/Votes"); // ✅
const articleRouter = require("./routes/Articles"); 



db.connect();


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
app.use("/api/votes", voteRouter);  // ✅ Voting routes
app.use("/api/articles", articleRouter);

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
app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
