import e from "express";
import mongoose from "mongoose";
const matchSchema = new mongoose.Schema({
  status: { type: String, enum: ["Live", "Completed"], default: "Live" },
  teams: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  ], // Two teams playing

  // Toss Information
  tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  tossDecision: { type: String, enum: ["Bat", "Bowl"] },

  // Match Details
  overs: { type: Number, required: true, default: 20 }, // Total overs
  //   venue: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Score Details
  teamScores: [
    {
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      oversPlayed: { type: Number, default: 0 },
    },
  ],

  // Result
  result: {
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    winBy: { type: String }, // Example: "Runs" or "Wickets"
  },
});

export default mongoose.model("Match", matchSchema);
