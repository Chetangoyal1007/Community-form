const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const Notification = require("../models/Notification");

// -----------------------------
// POST /api/questions → Add new question + notification
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const { questionName, questionUrl, category, user } = req.body;

    if (!questionName || !category) {
      return res
        .status(400)
        .send({ status: false, message: "Question and category are required" });
    }

    // 1️⃣ Create the question
    const newQuestion = await questionDB.create({ questionName, questionUrl, category, user });

    // 2️⃣ Create notification AFTER question saved
    const notification = new Notification({
      type: "question",
      message: `${user?.userName || "Someone"} asked a new question: "${questionName}"`,
      questionId: newQuestion._id,
      isRead: false,
      user,
    });
    await notification.save();

    // 3️⃣ Emit notification via socket.io if available
    const io = req.app.get("io");
    if (io) io.emit("notification", notification);

    res.status(201).send({
      status: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(400).send({ status: false, message: "Error while adding question" });
  }
});

// -----------------------------
// GET /api/questions → Fetch questions (optional category filter + populate answers)
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const questions = await questionDB.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
    ]);

    res.status(200).send({ status: true, data: questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).send({ status: false, message: "Error fetching questions" });
  }
});

// -----------------------------
// DELETE /api/questions/:id → Delete question + associated answers + notification
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const questionId = req.params.id;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).send({ status: false, message: "Invalid question ID" });
    }

    // ✅ Delete question
    const deletedQuestion = await questionDB.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).send({ status: false, message: "Question not found" });
    }

    // ✅ Delete all associated answers
    await answerDB.deleteMany({ questionId });

    // ✅ Optional: Notify about deletion
    const notification = new Notification({
      type: "system",
      message: `Question deleted: "${deletedQuestion.questionName}"`,
      isRead: false,
      user: deletedQuestion.user || {},
    });
    await notification.save();

    // ✅ Emit via socket.io
    const io = req.app.get("io");
    if (io) io.emit("notification", notification);

    res.status(200).send({
      status: true,
      message: "Question and its answers deleted successfully",
      data: deletedQuestion,
    });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).send({ status: false, message: "Failed to delete question" });
  }
});

module.exports = router;
console.log("✅ Question routes loaded");
