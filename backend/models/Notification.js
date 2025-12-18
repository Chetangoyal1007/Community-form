  const mongoose = require("mongoose");

  const NotificationSchema = new mongoose.Schema(
    {
      type: {
        type: String,
        enum: ["answer", "reply", "vote", "system","question","article"], 
        required: true,
      },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      user: {
        uid: { type: String },        
        userName: { type: String },
        email: { type: String },
        photo: { type: String },
      },
    },
    { timestamps: true } 
  );

  module.exports = mongoose.model("Notification", NotificationSchema);
