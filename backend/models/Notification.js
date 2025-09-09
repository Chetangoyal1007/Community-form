  const mongoose = require("mongoose");

  const NotificationSchema = new mongoose.Schema(
    {
      type: {
        type: String,
        enum: ["answer", "reply", "vote", "system","question"], // extendable
        required: true,
      },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      user: {
        uid: { type: String },         // Firebase UID
        userName: { type: String },
        email: { type: String },
        photo: { type: String },
      },
    },
    { timestamps: true } // adds createdAt & updatedAt
  );

  module.exports = mongoose.model("Notification", NotificationSchema);
