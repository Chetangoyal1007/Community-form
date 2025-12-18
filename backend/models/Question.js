const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: { type: String, required: true },
  questionUrl: String,
  category: { type: String, required: true }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
  user: Object,

 
  upVotes: { type: Number, default: 0 },
downVotes: { type: Number, default: 0 },

});

module.exports = mongoose.model("Questions", QuestionSchema);
