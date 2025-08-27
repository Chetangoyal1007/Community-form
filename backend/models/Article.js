const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String },
    imageUrl: { type: String },
    user: {
      uid: String,
      userName: { type: String, required: true },
      email: String,
      photo: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
