
const express = require("express");
const router = express.Router();
const questionDB = require("../models/Question");
const answerDB = require("../models/Answer"); 

// Improved search: returns questions with allAnswers populated (like main GET)
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.query;
    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).send({ status: false, message: "Query parameter is required" });
    }

    // Use aggregation to match and populate answers
    const questions = await questionDB.aggregate([
      { $match: { questionName: { $regex: searchQuery, $options: "i" } } },
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
    console.error(err);
    res.status(500).send({ status: false, message: "Error searching questions" });
  }
});

// -----------------------------
// POST /api/questions → Add new question
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const newQuestion = await questionDB.create({
      questionName: req.body.questionName,
      questionUrl: req.body.questionUrl,
      category: req.body.category, // save category
      user: req.body.user,
    });

    res.status(201).send({
      status: true,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({
      status: false,
      message: "Error while adding question",
    });
  }
});

// -----------------------------
// GET /api/questions → Fetch questions (optional filter by category)
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const categoryFilter = req.query.category;

    let matchStage = {};
    if (categoryFilter) {
      matchStage = { category: categoryFilter }; // filter by category
    }

    const questions = await questionDB.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "answers", // collection name in MongoDB
          localField: "_id",
          foreignField: "questionId",
          as: "allAnswers",
        },
      },
    ]);

    res.status(200).send(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      message: "Unable to get the question details",
    });
  }
});

// -----------------------------
// DELETE /api/questions/:id → Delete question
// -----------------------------
router.delete("/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    const deletedQuestion = await questionDB.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).send({ status: false, message: "Question not found" });
    }

    // Optional: delete all answers associated with this question
    await answerDB.deleteMany({ questionId: questionId });

    res.status(200).send({ status: true, message: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: false, message: "Failed to delete question" });
  }
});

module.exports = router;
console.log("✅ Question routes loaded");
