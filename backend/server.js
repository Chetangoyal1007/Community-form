const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PORT = 8080;
const db = require('./db.js');
const router = require("./routes");

// Database connection
db.connect();

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// Routes
app.use('/api', router);

// Serve frontend only in production
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

// Server listening
app.listen(process.env.PORT || PORT, () => {
    console.log(`✅ Listening on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
