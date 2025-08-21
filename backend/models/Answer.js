const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },

  // Links answer to a question
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
  },

  // New: allow nested replies (answers to answers)
  parentAnswerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "answers",
    default: null, // null means it's a direct answer to a question
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Answers", AnswerSchema);
