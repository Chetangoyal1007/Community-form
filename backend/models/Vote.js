const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // who voted (use email or user._id)
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // questionId or answerId
    targetType: { 
      type: String, 
      enum: ["question", "answer"], 
      required: true 
    },
    direction: { 
      type: String, 
      enum: ["up", "down"], 
      required: true 
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate votes (one per user per target)
VoteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model("Vote", VoteSchema);
