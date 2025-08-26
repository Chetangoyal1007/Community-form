const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const Question = require("../models/Question");
const Answer = require("../models/Answer");


router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming vote request:", req.body); // 👈 log body

    const { userId, targetId, targetType, direction } = req.body;

    if (!userId || !targetId || !targetType || !direction) {
      return res.status(400).json({ 
        message: "Missing fields", 
        received: req.body // 👈 send back body for debugging
      });
    }

    let existingVote = await Vote.findOne({ userId, targetId, targetType });

    if (existingVote) {
      if (existingVote.direction === direction) {
        await Vote.deleteOne({ _id: existingVote._id });
      } else {
        existingVote.direction = direction;
        await existingVote.save();
      }
    } else {
      await Vote.create({ userId, targetId, targetType, direction });
    }

    const votes = await Vote.find({ targetId, targetType });
    const total = votes.reduce((sum, v) => sum + (v.direction === "up" ? 1 : -1), 0);

    if (targetType === "question") {
      await Question.findByIdAndUpdate(targetId, { votes: total });
    } else {
      await Answer.findByIdAndUpdate(targetId, { votes: total });
    }

    res.json({ message: "Vote updated", totalVotes: total });
  } catch (e) {
    console.error("❌ Voting error:", e);
    res.status(500).json({ message: "Error while voting" });
  }
});

module.exports = router;
