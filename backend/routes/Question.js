const express = require("express");
const router = express.Router();

const questionDB = require("../models/Question");

// POST /api/questions → Add new question
router.post("/", async (req, res) => {
  try {
    const newQuestion = await questionDB.create({
      questionName: req.body.questionName,
      questionUrl: req.body.questionUrl,
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

// GET /api/questions → Fetch questions with answers
router.get("/", async (req, res) => {
  try {
    const questions = await questionDB.aggregate([
      {
        $lookup: {
          from: "answers", // collection to join
          localField: "_id", // field from questions
          foreignField: "questionId", // field in answers
          as: "allAnswers", // output array field
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

module.exports = router;
console.log("✅ Question routes loaded");
