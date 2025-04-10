import Match from "../Database/MatchSchema.js";  // Import Match model

// Create a Match
export const createMatch = async (req, res) => {
    try {
      const {
        teams,  
        tossWinner,
        tossDecision,
        overs,
        date,
      } = req.body;
  
      // Ensure that exactly two teams are provided
      if (!Array.isArray(teams) || teams.length !== 2) {
        return res.status(400).json({ error: "Teams field must contain exactly two teams" });
      }
  
      const newMatch = new Match({
        teams,
        tossWinner,
        tossDecision,
        overs,
        date,
      });
  
      await newMatch.save();
      res.status(201).json({ message: "Match created successfully", match: newMatch });
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ error: "Failed to create match" });
    }
  };
  

// Get Match by ID
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate([
      { path: 'teams', select: 'name' },
      { path: 'tossWinner', select: 'name' },
      { path: 'teamScores.team', select: 'name' },
      { path: 'result.winner', select: 'name' },
    ]);
    if (!match) return res.status(404).json({ message: "Match not found" });

    res.status(200).json(match);
  } catch (error) {
    console.error("Error fetching match:", error);
    res.status(500).json({ error: "Failed to fetch match" });
  }
};

// Update Match (For live score updates, etc.)
export const updateMatch = async (req, res) => {
  try {
    const {
      status,
      teams,
      tossWinner,
      tossDecision,
      overs,
      venue,
      date,
      teamScores,
      result,
    } = req.body;

    const match = await Match.findByIdAndUpdate(
      req.params.matchId,
      {
        status,
        teams,
        tossWinner,
        tossDecision,
        overs,
        venue,
        date,
        teamScores,
        result,
      },
      { new: true }
    );

    if (!match) return res.status(404).json({ message: "Match not found" });

    res.status(200).json({ message: "Match updated successfully", match });
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ error: "Failed to update match" });
  }
};

// Get All Matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().populate([
      { path: 'teams', select: 'name' },
      { path: 'tossWinner', select: 'name' },
      { path: 'teamScores.team', select: 'name' },
      { path: 'result.winner', select: 'name' },
    ]);
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

// End a Match (Mark it as Completed)
export const endMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.matchId,
      { status: "Completed" },
      { new: true }
    );

    if (!match) return res.status(404).json({ message: "Match not found" });

    res.status(200).json({ message: "Match ended successfully", match });
  } catch (error) {
    console.error("Error ending match:", error);
    res.status(500).json({ error: "Failed to end match" });
  }
};
