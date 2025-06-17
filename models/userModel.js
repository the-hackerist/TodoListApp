const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "todo",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
