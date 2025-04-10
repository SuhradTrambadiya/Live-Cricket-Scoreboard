import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"], required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }, // Reference to the team
  totalMatches: { type: Number, default: 0 },

  // Batting Stats
  totalRuns: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  battingAverage: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },

  // Bowling Stats
  totalWickets: { type: Number, default: 0 },
  bestBowlingFigures: { type: String, default: "0/0" },
  bowlingAverage: { type: Number, default: 0 },
  economyRate: { type: Number, default: 0 },

  // Match History (Performance per match)
  matchHistory: [
    {
      matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
      runsScored: { type: Number, default: 0 },
      ballsFaced: { type: Number, default: 0 },
      wicketsTaken: { type: Number, default: 0 },
      oversBowled: { type: Number, default: 0 },
      runsConceded: { type: Number, default: 0 },
      isOut: { type: Boolean, default: false },
      outType: { type: String, enum: ["Bowled", "Caught", "LBW", "Run Out", "Stumped", "None"], default: "None" },
    },
  ],
});

export default mongoose.model("Player", playerSchema);
