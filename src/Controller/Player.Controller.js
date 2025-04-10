import Player from "../Database/PlayerSchema.js";

// Create a new player
export const createPlayer = async (req, res) => {
  try {
    const { name, role, jerseyNumber, team } = req.body;

    const newPlayer = new Player({
      name,
      role,
      jerseyNumber,
      team,
    });

    await newPlayer.save();

    res.status(201).json({
      message: "Player created successfully",
      player: newPlayer,
    });
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ error: "Failed to create player" });
  }
};

// Get all players
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate("team", "name");
    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ error: "Failed to get players" });
  }
};

// Get a player by ID
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate("team", "name");
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ error: "Failed to get player" });
  }
};

// Delete a player by ID
export const deletePlayer = async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Player not found" });

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ error: "Failed to delete player" });
  }
};
