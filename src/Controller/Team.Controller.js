// src/controllers/team.controller.js

import Team from "../Database/TeamSchema.js";
import Player from "../Database/PlayerSchema.js";

// Create a new team with optional players
export const createTeam = async (req, res) => {
  try {
    const {
      name,
      shortName,
      players = [],  // Default to an empty array if no players are provided
      matchesPlayed = 0,
      matchesWon = 0,
      matchesLost = 0,
      points = 0,
      netRunRate = 0
    } = req.body;

    // Step 1: Create the team
    const newTeam = await Team.create({
      name,
      shortName,
      matchesPlayed,
      matchesWon,
      matchesLost,
      points,
      netRunRate
    });

    // Step 2: If players are provided, create player documents and link them to the team
    let playerDocs = [];
    if (players.length > 0) {
      playerDocs = await Promise.all(
        players.map(async (player) => {
          return await Player.create({
            ...player,
            team: newTeam._id,
          });
        })
      );

      // Step 3: Add player IDs to the team if players were created
      newTeam.players = playerDocs.map((player) => player._id);
      await newTeam.save();
    }

    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
      players: playerDocs,  // Will be empty if no players are provided
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all teams with players
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to get teams" });
  }
};

// Optional: Get team by ID
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Failed to get team" });
  }
};
