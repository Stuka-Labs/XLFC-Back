import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsAdmin} from "../utils/auth-verification-util";
import {playerExists, teamExists} from "../utils/manage-team-util";

export const deletePlayerTeamApp = express();

deletePlayerTeamApp.use(bodyParser.json());
deletePlayerTeamApp.use(cors({origin: true}));
deletePlayerTeamApp.use(getUserCredentialsMiddleware);

deletePlayerTeamApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Player Team Function");
  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Delete Player Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (!(await teamExists(req.body.teamId))) {
      const message = `Could not find a team 
      with the given id: ${req.body.teamId}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (!(await playerExists(req.body.playerId))) {
      const message = `Could not find player with given id: 
      ${req.body.playerId}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    await db.collection("players").doc(req.body.playerId).set({
      teamId: "",
    });
    res.status(200).json({message: "Player Removed From Team Successfully"});
  } catch (err) {
    const message = "Could not remove player from team";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
