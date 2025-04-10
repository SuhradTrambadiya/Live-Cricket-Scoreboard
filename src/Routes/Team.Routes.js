// routes/team.routes.js
import { Router } from "express";
import { createTeam, getAllTeams, getTeamById } from "../Controller/Team.Controller.js";

const TeamRoutes = Router();

// @route   POST /api/teams
// @desc    Create a new team
TeamRoutes.post("/", createTeam);
TeamRoutes.get("/", getAllTeams);
TeamRoutes.get("/:id", getTeamById);
export default TeamRoutes;
