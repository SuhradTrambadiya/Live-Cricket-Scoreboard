import LiveScore from "../Database/LiveScoreSchema.js";

// Create Live Score
export const createLiveScore = async (req, res) => {
  try {
    const {
      matchId,
      runs,
      wickets,
      currentover,
      currentStriker,
      currentNonStriker,
      currentBowler,
      playerPerformance,
      matchHistory,
    } = req.body;

    const newLiveScore = new LiveScore({
      matchId,
      runs,
      wickets,
      currentover,
      currentStriker,
      currentNonStriker,
      currentBowler,
      playerPerformance,  // Array of player performances
      matchHistory,  // Array of ball-by-ball history
      isLive: true, // Mark this match as live
    });

    await newLiveScore.save();
    res.status(201).json({ message: "Live score created successfully", liveScore: newLiveScore });
  } catch (error) {
    console.error("Error creating live score:", error);
    res.status(500).json({ error: "Failed to create live score" });
  }
};


export const updateLiveScore = async (req, res) => {
  try {
    const {
      runs,
      wickets,
      currentover,
      currentStriker,
      currentNonStriker,
      currentBowler,
      playerPerformance,
      matchHistory,
    } = req.body;

    console.log("matchId received:", req.params.matchId);

    // Fetch the current live score
    const liveScore = await LiveScore.findOne({ matchId: req.params.matchId });
    if (!liveScore) {
      return res.status(404).json({ message: "Live score not found" });
    }

    // // Get the last ball number in the match history to increment for the next ball
     const lastBall = liveScore.matchHistory[liveScore.matchHistory.length - 1];
    const nextBallNumber = lastBall ? lastBall.ballNumber + 1 : 1; // Start from 1 if no history

    // Function to update player performance
    const updatePlayerPerformance = (playerId, runs, ballsFaced, isOut, outType, wickets, oversBowled) => {
      let playerPerf = playerPerformance.find(p => p.playerId.toString() === playerId.toString());
      if (!playerPerf) {
        // If no performance entry for this player, create one
        playerPerf = {
          playerId,
          runs: 0,
          ballsFaced: 0,
          isOut: false,
          outType: "None",
          wicketsTaken: 0,
          runsConceded: 0,
          oversBowled: 0,
        };
        playerPerformance.push(playerPerf);
      }

      // If the player is a batsman
      if (runs > 0) {
        playerPerf.runs += runs;  // Add runs
        playerPerf.ballsFaced += ballsFaced;  // Add balls faced
      }

      playerPerf.isOut = isOut;  // Update if the player is out
      playerPerf.outType = isOut ? outType : "None";  // If out, specify the type of out (e.g., Bowled, Caught)
      
      // If the player is a bowler
      playerPerf.wicketsTaken += wickets > 0 ? 1 : 0;  // Add wickets taken
      playerPerf.runsConceded += runs;  // Add runs conceded (runs scored off the bowler)
      playerPerf.oversBowled += oversBowled;  // Add overs bowled
    };

    // Ball history for the current ball
    const ballHistory = {
      ballNumber: nextBallNumber,
      batsman: currentStriker,
      runs,
      extras: 0, // Assuming no extras for simplicity, adjust as needed
      wicketTaken: wickets > 0, // Assume wicket is taken if wickets > 0
      outType: wickets > 0 ? "Bowled" : "None",  // Assume bowled if wickets > 0
      bowler: currentBowler,
      deliveryType: "Normal",  // Assuming normal delivery; adjust as needed
    };

    // Update performance for the striker (batsman)
    updatePlayerPerformance(currentStriker, runs, 1, false, "None", wickets, 0); // Update striker’s performance

    // Update performance for the bowler
    updatePlayerPerformance(currentBowler, 0, 0, false, "None", wickets, 1); // Update bowler’s performance

    // If a wicket is taken, mark the striker as out and update performance
    if (wickets > 0) {
      const player = playerPerformance.find(p => p.playerId.toString() === currentStriker.toString());
      if (player) {
        player.isOut = true;
        player.outType = "Bowled";  // Update outType based on the wicket type (adjust as necessary)
      }

      // Replace the striker with the non-striker and set a new striker
      const temp = currentStriker;
      currentStriker = currentNonStriker;
      currentNonStriker = temp;
    }

    // Update live score with the new stats (runs, wickets, overs, striker, bowler, performance, history)
    const updatedLiveScore = await LiveScore.findOneAndUpdate(
      { matchId: req.params.matchId },
      {
        $set: {
          runs: liveScore.runs + runs,
          wickets: liveScore.wickets + wickets,
          currentover: currentover,
          currentStriker,
          currentNonStriker,
          currentBowler,
          playerPerformance,
          matchHistory: [...liveScore.matchHistory, ballHistory],
        },
      },
      { new: true }
    );

    if (!updatedLiveScore) {
      return res.status(500).json({ message: "Error updating live score" });
    }

    res.status(200).json({ message: "Live score updated successfully", liveScore: updatedLiveScore });
  } catch (error) {
    console.error("Error updating live score:", error);
    res.status(500).json({ error: "Failed to update live score" });
  }
};


// Get Live Score by Match ID
export const getLiveScoreByMatchId = async (req, res) => {
  try {
    const liveScore = await LiveScore.findOne({ matchId: req.params.matchId }).populate([
      { path: 'currentStriker', select: 'name' },
      { path: 'currentNonStriker', select: 'name' },
      { path: 'currentBowler', select: 'name' },
      { path: 'playerPerformance.playerId', select: 'name' },
      { path: 'matchHistory.batsman', select: 'name' },
      { path: 'matchHistory.bowler', select: 'name' }
    ]);
    if (!liveScore) return res.status(404).json({ message: "Live score not found" });

    res.status(200).json(liveScore);
  } catch (error) {
    console.error("Error fetching live score:", error);
    res.status(500).json({ error: "Failed to get live score" });
  }
};

// Update Live Score


// Get All Live Scores (Optional)
export const getAllLiveScores = async (req, res) => {
  try {
    const liveScores = await LiveScore.find().populate([
      { path: 'currentStriker', select: 'name' },
      { path: 'currentNonStriker', select: 'name' },
      { path: 'currentBowler', select: 'name' },
    ]);
    res.status(200).json(liveScores);
  } catch (error) {
    console.error("Error fetching live scores:", error);
    res.status(500).json({ error: "Failed to get live scores" });
  }
};


// End Live Match
export const endLiveMatch = async (req, res) => {
  try {
    const liveScore = await LiveScore.findOneAndUpdate(
      { matchId: req.params.matchId },
      { isLive: false },
      { new: true }
    );

    if (!liveScore) return res.status(404).json({ message: "Live score not found" });

    res.status(200).json({ message: "Live match ended successfully", liveScore });
  } catch (error) {
    console.error("Error ending live match:", error);
    res.status(500).json({ error: "Failed to end live match" });
  }
};
