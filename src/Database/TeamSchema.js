import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  shortName: { type: String, required: true }, // e.g., "IND", "AUS"
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], 
  matchesPlayed: { type: Number, default: 0 },
  matchesWon: { type: Number, default: 0 },
  matchesLost: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  netRunRate: { type: Number, default: 0 },
});

export default mongoose.model("Team", teamSchema);