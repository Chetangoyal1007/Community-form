// backend/routes/Notification.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ✅ Create a new notification
router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io"); // get socket.io instance
    const notification = new Notification(req.body);
    await notification.save();

    // emit to all connected clients
    io.emit("notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
