const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // who voted
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // question or answer
  targetType: { type: String, enum: ["question", "answer"], required: true },
  direction: { type: String, enum: ["up", "down"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Vote", VoteSchema);
