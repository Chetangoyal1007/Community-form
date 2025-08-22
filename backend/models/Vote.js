const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "answers",
    default: null,   // ✅ allow null if voting on a question
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
    default: null,   // ✅ allow null if voting on an answer
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // if you have a User model
    ref: "users",
    required: true,
  },
  voteType: {
    type: String,
    enum: ["up", "down"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one vote per user per answer/question
VoteSchema.index({ userId: 1, answerId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model("votes", VoteSchema);
