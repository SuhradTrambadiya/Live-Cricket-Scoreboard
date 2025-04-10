import express from 'express';
import { createLiveScore, endLiveMatch, getAllLiveScores, getLiveScoreByMatchId, updateLiveScore } from '../Controller/Live-Score.Controller.js';

const LiveScoreRoutes = express.Router();

// Route to create a new live score
LiveScoreRoutes.post('/live-scores', createLiveScore);

// Route to get live score by match ID
LiveScoreRoutes.get('/live-scores/:matchId', getLiveScoreByMatchId);

// Route to update live score of a match
LiveScoreRoutes.put('/live-scores/:matchId', updateLiveScore);

// Route to get all live scores (optional)
LiveScoreRoutes.get('/live-scores', getAllLiveScores);

// Route to end a live match
LiveScoreRoutes.put('/live-scores/:matchId/end', endLiveMatch);

export default LiveScoreRoutes;
