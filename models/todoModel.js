const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("todo", todoSchema);
