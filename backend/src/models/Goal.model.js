import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: "#3498db",
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model("Goal", GoalSchema);