
const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
    required: true,
  },
  parentAnswerId: {   
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
    default: null,
  },
  answer: { type: String, required: true },
  user: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  upVotes: { type: Number, default: 0 },
  downVotes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Answers", AnswerSchema);
