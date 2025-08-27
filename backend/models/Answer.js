const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
    required: true,
  },
  answer: { type: String, required: true },
  user: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // ✅ votes field
  upVotes: { type: Number, default: 0 },
downVotes: { type: Number, default: 0 },

  // ✅ replies for nested answers
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
});

module.exports = mongoose.model("Answers", AnswerSchema);
