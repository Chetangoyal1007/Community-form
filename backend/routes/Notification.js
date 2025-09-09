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
// ✅ Get all notifications with unread count
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Mark a single notification as read
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

// ✅ Mark all notifications as read
router.put("/mark-read", async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
