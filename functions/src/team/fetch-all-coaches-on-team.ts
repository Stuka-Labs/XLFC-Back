import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {userSignedIn} from "../utils/auth-verification-util";

export const FetchCoachesOnTeamApp = express();

FetchCoachesOnTeamApp.use(bodyParser.json());
FetchCoachesOnTeamApp.use(cors({origin: true}));
FetchCoachesOnTeamApp.use(getUserCredentialsMiddleware);

// Fetch coaches on team
FetchCoachesOnTeamApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch All Coaches on Team Function");
  try {
    if (!(userSignedIn(req))) {
      const message = "Access Denied For Fetch All Coches On Team";
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
    const coachesSnapshot = await db
      .collection("coaches").where("teamIds", "array-contains", teamId).get();
    res.status(200).json({data: coachesSnapshot});
  } catch (err) {
    const message = "Could not fetch coaches for team.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
