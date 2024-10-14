import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsPlayer} from "../utils/auth-verification-util";

export const assignPlayerTeamApp = express();

assignPlayerTeamApp.use(bodyParser.json());
assignPlayerTeamApp.use(cors({origin: true}));
assignPlayerTeamApp.use(getUserCredentialsMiddleware);

assignPlayerTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Assign Player Team Function");

  try {
    if (!(authIsPlayer(req))) {
      const message = "Access Denied For Assign Player Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }

    const uid = req["uid"];
    const playerRef = db.collection("players").doc(uid);
    const player = await playerRef.get();
    if (!player.exists) {
      const message = "Access Denied For Assign Player Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamId = req.body.teamId;
    const teamRef = db.collection("teams").doc(teamId);
    const team = await teamRef.get();
    if (!team.exists) {
      const message = `Could not find a team with the given id: ${teamId}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    await db.doc(`players/${uid}`).set({
      teamId: team.id,
      startWeight: 0,
      height: 0,
      startBmi: 0,
    });
    res.status(200).json({message: "Player Assigned to Team Successfully"});
  } catch (err) {
    const message = "Could not assign player to team";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
