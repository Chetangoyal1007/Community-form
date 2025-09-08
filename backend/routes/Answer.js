const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const answerDB = require("../models/Answer");
const Notification = require("../models/Notification");

// Utility: strip HTML for cleaner notifications
const stripHtml = (html) => html.replace(/<(.|\n)*?>/g, "").trim();

/**
 * ✅ POST: Add a new answer or reply
 */
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

    // Prepare notification payload
    const notifPayload = {
      type: parentAnswerId ? "reply" : "answer",
      message: parentAnswerId
        ? `${user.userName || "Someone"} replied: "${stripHtml(answer)}"`
        : `${user.userName || "Someone"} answered: "${stripHtml(answer)}"`,
      isRead: false,
      user: {
        uid: user.uid,
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

/**
 * ✅ GET: Fetch answers for a question (with pagination)
 * Example: GET /answers/:questionId?page=1&limit=5
 */
router.get("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Count total answers for this question
    const totalAnswers = await answerDB.countDocuments({
      questionId,
      parentAnswerId: null, // fetch only top-level answers
    });

    // Fetch answers with pagination
    const answers = await answerDB
      .find({ questionId, parentAnswerId: null })
      .populate("replies") // populate replies array
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      status: true,
      message: "Answers fetched successfully",
      data: answers,
      pagination: {
        total: totalAnswers,
        page,
        limit,
        totalPages: Math.ceil(totalAnswers / limit),
      },
    });
  } catch (e) {
    console.error("❌ Error fetching answers:", e.message, e.stack);
    res.status(500).send({
      status: false,
      message: "Error while fetching answers",
    });
  }
});

/**
 * ✅ DELETE: Remove an answer or reply
 */
router.delete("/:id", async (req, res) => {
  try {
    const answerId = req.params.id;

    // Find the answer
    const answer = await answerDB.findById(answerId);
    if (!answer) {
      return res.status(404).send({ status: false, message: "Answer not found" });
    }

    // If it's a reply, remove from parent's replies array
    if (answer.parentAnswerId) {
      await answerDB.findByIdAndUpdate(answer.parentAnswerId, {
        $pull: { replies: answerId },
      });
      console.log("✅ Reply removed from parent:", answer.parentAnswerId);
    }

    // Delete notifications related to this answer
    await Notification.deleteMany({
      message: { $regex: stripHtml(answer.answer), $options: "i" },
      "user.uid": answer.user?.uid,
    });

    // Delete the answer itself
    await answerDB.findByIdAndDelete(answerId);

    res.status(200).send({
      status: true,
      message: "Answer deleted successfully",
    });
  } catch (e) {
    console.error("❌ Error deleting answer:", e.message, e.stack);
    res.status(500).send({
      status: false,
      message: "Error while deleting answer",
    });
  }
});

module.exports = router;
