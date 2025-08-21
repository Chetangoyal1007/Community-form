const express = require("express");
const router = express.Router();

const answerDB = require("../models/Answer");

// POST: Add a new answer or reply
router.post("/", async (req, res) => {
  try {
    const { answer, questionId, parentAnswerId, user } = req.body;

    if (!answer || !user) {
      return res.status(400).send({
        status: false,
        message: "Answer text and user are required",
      });
    }

    const newAnswer = await answerDB.create({
      answer,
      questionId: questionId || null, // null if it's only a reply
      parentAnswerId: parentAnswerId || null, // null if it's a direct answer
      user,
    });

    res.status(201).send({
      status: true,
      message: "Answer added successfully",
      data: newAnswer,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      status: false,
      message: "Error while adding answer",
    });
  }
});

// GET: Fetch answers for a question (with optional nesting)
router.get("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    // Get only top-level answers (parentAnswerId = null)
    const answers = await answerDB
      .find({ questionId, parentAnswerId: null })
      .sort({ createdAt: -1 });

    res.status(200).send({
      status: true,
      data: answers,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      status: false,
      message: "Error while fetching answers",
    });
  }
});

// GET: Fetch replies for a given answer
router.get("/replies/:answerId", async (req, res) => {
  try {
    const { answerId } = req.params;

    const replies = await answerDB
      .find({ parentAnswerId: answerId })
      .sort({ createdAt: -1 });

    res.status(200).send({
      status: true,
      data: replies,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      status: false,
      message: "Error while fetching replies",
    });
  }
});

// DELETE: Remove answer (and optionally its replies)
router.delete("/:id", async (req, res) => {
  try {
    const deletedAnswer = await answerDB.findByIdAndDelete(req.params.id);

    if (!deletedAnswer) {
      return res.status(404).send({
        status: false,
        message: "Answer not found",
      });
    }

    // Also delete replies to this answer
    await answerDB.deleteMany({ parentAnswerId: req.params.id });

    res.status(200).send({
      status: true,
      message: "Answer and its replies deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      status: false,
      message: "Error while deleting answer",
    });
  }
});

module.exports = router;
