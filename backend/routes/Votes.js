// routes/Votes.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const Vote = require("../models/Vote");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

// 🔒 Rate limiter: Max 2 votes per 10 seconds per user/IP
const voteLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 2,
  keyGenerator: (req) => req.body.userId || req.ip,
  message: { message: "Too many votes, please slow down." },
});

router.post("/", voteLimiter, async (req, res) => {
  try {
    const { userId, targetId, targetType, direction } = req.body;

    if (!userId || !targetId || !targetType || !direction) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // ✅ Find existing vote
    let vote = await Vote.findOne({ userId, targetId, targetType });

    if (vote) {
      // Same direction again → ignore
      if (vote.direction === direction) {
        return res.json({ message: "Already voted this way" });
      }

      // Switch vote
      if (vote.direction === "up") {
        await updateVoteCount(targetType, targetId, -1, "upVotes");
        await updateVoteCount(targetType, targetId, 1, "downVotes");
      } else {
        await updateVoteCount(targetType, targetId, -1, "downVotes");
        await updateVoteCount(targetType, targetId, 1, "upVotes");
      }

      vote.direction = direction;
      await vote.save();
      return res.json({ message: "Vote switched" });
    } else {
      // ✅ New vote
      vote = new Vote({ userId, targetId, targetType, direction });
      await vote.save();

      if (direction === "up") {
        await updateVoteCount(targetType, targetId, 1, "upVotes");
      } else {
        await updateVoteCount(targetType, targetId, 1, "downVotes");
      }

      return res.json({ message: "Vote added" });
    }
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔧 Update votes safely (never negative)
async function updateVoteCount(targetType, targetId, delta, field) {
  const model = targetType === "question" ? Question : Answer;

  await model.findByIdAndUpdate(
    targetId,
    [
      {
        $set: {
          [field]: {
            $max: [{ $add: [`$${field}`, delta] }, 0], // never less than 0
          },
        },
      },
    ],
    { new: true }
  );
}

module.exports = router;
