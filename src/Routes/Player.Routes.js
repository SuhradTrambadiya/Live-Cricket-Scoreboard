import express from "express";
import {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  deletePlayer,
} from "../Controller/Player.Controller.js";

const router = express.Router();

// Create a player
router.post("/players", createPlayer);

// Get all players
router.get("/players", getAllPlayers);

// Get a player by ID
router.get("/players/:id", getPlayerById);

// Delete a player by ID
router.delete("/players/:id", deletePlayer);

export default router;
