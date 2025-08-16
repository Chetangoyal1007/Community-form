// const mongoose = require("mongoose");

// const QuestionSchema = new mongoose.Schema({
//   questionName: String,
//   questionUrl: String,
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
//   answers: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Answers",
//   },
//   user: Object,
// });

// module.exports = mongoose.model("Questions", QuestionSchema);


const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: { type: String, required: true },
  questionUrl: String,
  category: { type: String, required: true }, // ✅ Added category
  createdAt: {
    type: Date,
    default: Date.now,
  },
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
  },
  user: Object,
});

module.exports = mongoose.model("Questions", QuestionSchema);
