const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");

// Create / update vote
router.post("/", async (req, res) => {
  try {
    const { answerId, questionId, userId, voteType } = req.body;

    if (!userId || (!answerId && !questionId)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // find existing
    let vote = await Vote.findOne({ userId, answerId, questionId });
    if (vote) {
      vote.voteType = voteType;
      await vote.save();
    } else {
      vote = new Vote({ userId, answerId, questionId, voteType });
      await vote.save();
    }

    res.json({ message: "Vote recorded", vote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
