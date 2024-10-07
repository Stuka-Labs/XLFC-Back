import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {userSignedIn} from "../utils/auth-verification-util";

export const FetchPlayersOnTeamApp = express();

FetchPlayersOnTeamApp.use(bodyParser.json());
FetchPlayersOnTeamApp.use(cors({origin: true}));
FetchPlayersOnTeamApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchPlayersOnTeamApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch All Players on Team Function");
  try {
    if (!(userSignedIn(req))) {
      const message = "Access Denied For Fetch All Players On Team";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamId = req.query.teamId as string;
    const teamRef = db.collection("teams").doc(teamId);
    const team = await teamRef.get();
    if (!team.exists) {
      const message = "Unable to locate team with given id";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const playersSnapshot = await db
      .collection("players").where("teamIdRef", "==", teamRef).get();
    res.status(200).json({data: playersSnapshot});
  } catch (err) {
    const message = "Could not fetch players on team.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
