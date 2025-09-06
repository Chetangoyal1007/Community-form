// backend/routes/Answer.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const answerDB = require("../models/Answer");
const Notification = require("../models/Notification");

// Utility: strip HTML for cleaner notifications
const stripHtml = (html) => {
  return html.replace(/<(.|\n)*?>/g, "").trim();
};

// ✅ POST: Add a new answer or reply
router.post("/", async (req, res) => {
  try {
    const { answer, questionId, parentAnswerId, user } = req.body;

    if (!answer || !user) {
      return res.status(400).send({
        status: false,
        message: "Answer text and user are required",
      });
    }

    // Create new answer
    const newAnswer = await answerDB.create({
      answer,
      questionId: questionId || null,
      parentAnswerId: parentAnswerId || null,
      user,
    });
    console.log("✅ New answer created:", newAnswer._id);

    // If reply, push into parent answer's replies array
    if (parentAnswerId) {
      await answerDB.findByIdAndUpdate(parentAnswerId, {
        $push: { replies: newAnswer._id },
      });
      console.log("✅ Added reply to parent answer:", parentAnswerId);
    }

    // Prepare notification payload// Utility: strip HTML tags from answer for notification
const stripHtml = (html) => html.replace(/<(.|\n)*?>/g, "").trim();

// Prepare notification payload
const notifPayload = {
  type: parentAnswerId ? "reply" : "answer",
  message: parentAnswerId
    ? `${user.userName || "Someone"} replied: "${stripHtml(answer)}"`
    : `${user.userName || "Someone"} answered: "${stripHtml(answer)}"`,
  isRead: false,
  user: {
    uid: user.uid,             // Firebase UID as string
    userName: user.userName,
    email: user.email,
    photo: user.photo,
  },
};

// Save notification
let notifDoc;
try {
  notifDoc = await Notification.create(notifPayload);
  console.log("✅ Notification saved:", notifDoc._id);
} catch (err) {
  console.error("❌ Failed to save notification:", err.message);
}

// Emit via Socket.IO if connected
const io = req.app.get("io");
if (io && notifDoc) {
  io.emit("notification", notifDoc);
  console.log("📡 Notification emitted via Socket.IO");
} else if (!io) {
  console.log("⚠️ Socket.IO instance not found");
}


    res.status(201).send({
      status: true,
      message: "Answer added successfully",
      data: newAnswer,
    });
  } catch (e) {
    console.error("❌ Error in Answer POST:", e.message, e.stack);

    res.status(500).send({
      status: false,
      message: "Error while adding answer",
    });
  }
});

module.exports = router;
