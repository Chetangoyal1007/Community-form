
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");


router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io"); 
    const notification = new Notification(req.body);
    await notification.save();

    
    io.emit("notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



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


router.put("/mark-read", async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
