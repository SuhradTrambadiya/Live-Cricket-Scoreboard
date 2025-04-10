import mongoose from "mongoose";

const liveScoreSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },

  // Match Live Score
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  currentover: { type: Number, default: 0 },

  // Current Batsmen and Bowler
  currentStriker: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  currentNonStriker: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  currentBowler: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },

  // Player Performance in the Match
  playerPerformance: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      runs: { type: Number, default: 0 },
      ballsFaced: { type: Number, default: 0 },
      isOut: { type: Boolean, default: false },
      outType: { type: String, enum: ["Bowled", "Caught", "LBW", "Run Out", "Stumped", "None"], default: "None" }, 
      wicketsTaken: { type: Number, default: 0 },
      runsConceded: { type: Number, default: 0 },
      oversBowled: { type: Number, default: 0 },
    },
  ],
  

  // Ball-by-Ball History
  matchHistory: [
    {
      ballNumber: { type: Number, required: true },
      batsman: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      runs: { type: Number, default: 0 },
      extras: { type: Number, default: 0 },
      wicketTaken: { type: Boolean, default: false },
      outType: { type: String, enum: ["Bowled", "Caught", "LBW", "Run Out", "Stumped", "None"], default: "None" },
      bowler: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      deliveryType: { type: String, enum: ["Normal", "Wide", "NoBall"], default: "Normal" },
    },
  ],
});

export default mongoose.model("LiveScore", liveScoreSchema);
