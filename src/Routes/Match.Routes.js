import express from "express";
import {
  createMatch,
  getMatchById,
  updateMatch,
  getAllMatches,
  endMatch,
} from "../Controller/Match.Controller.js";

const router = express.Router();

// Create a Match
router.post("/", createMatch);

// Get a Match by ID
router.get("/:matchId", getMatchById);

// Update a Match
router.put("/:matchId", updateMatch);

// Get All Matches
router.get("/", getAllMatches);

// End a Match
router.put("/end/:matchId", endMatch);

export default router;
