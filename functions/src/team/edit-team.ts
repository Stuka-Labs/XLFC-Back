import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {coachExists, teamExists} from "../utils/manage-team-util";
import {authIsAdmin} from "../utils/auth-verification-util";

export const editTeamApp = express();

editTeamApp.use(bodyParser.json());
editTeamApp.use(cors({origin: true}));
editTeamApp.use(getUserCredentialsMiddleware);

// Create Team
editTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Edit Team Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Edit Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamUid = req.body.teamUid;
    const teamName = req.body.teamName;
    const coachUid = req.body.coachUid;
    const description = req.body.description;
    if (!(await teamExists(teamUid))) {
      const message = "Could not find team with uid " + teamUid;
      functions.logger.debug(message);
      res.status(404).json({message: message});
      return;
    }
    if (!(await coachExists(coachUid))) {
      const message = "Could not find coach with uid " + coachUid;
      functions.logger.debug(message);
      res.status(404).json({message: message});
      return;
    }
    if (!teamName) {
      const message = "Invalid team name";
      functions.logger.debug(message);
      res.status(400).json({message: message});
      return;
    }
    if (!description) {
      const message = "Invalid description";
      functions.logger.debug(message);
      res.status(400).json({message: message});
      return;
    }
    const teamRef = db.collection("teams").doc(teamUid);
    const team = await teamRef.get();
    const coachRef = db.collection("coaches").doc(coachUid);
    await db.collection("teams").doc().set({
      name: teamName,
      coachRef: coachRef,
      description: description,
      active: team.data()?.active,
    });
    res.status(200)
      .json({message: "Team Edited Successfully"});
  } catch (err) {
    const message = "Could not Edit Team.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
