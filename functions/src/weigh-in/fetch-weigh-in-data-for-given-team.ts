import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";

export const FetchWeighInDataForGivenTeamApp = express();

FetchWeighInDataForGivenTeamApp.use(bodyParser.json());
FetchWeighInDataForGivenTeamApp.use(cors({origin: true}));
FetchWeighInDataForGivenTeamApp.use(getUserCredentialsMiddleware);

// Fetch all weigh in data for given team
FetchWeighInDataForGivenTeamApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data For Team Function");

  try {
    if (!(req["uid"])) {
      const message = "Access Denied For Submit Weight In Data Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamId = req.query.teamId as string;
    if (!teamId) {
      return;
    }
    const teamRef = db.collection("teams").doc(teamId);
    const playersSnapshot = await db.collection("players")
      .where("teamRef", "==", teamRef).get();
    const playerRefs: any = [];
    playersSnapshot.forEach((record) => {
      const playerRef = db.collection("players").doc(record.id);
      playerRefs.push(playerRef);
    });
    const queryWeighInDataSnapshot = await db.collection("weightLog")
      .where("playerRef", "in", playerRefs)
      .get();
    if (queryWeighInDataSnapshot.empty) {
      const data = [];
      res.status(200).json({data: data});
      return;
    }

    const weighInRecords: any = [];
    queryWeighInDataSnapshot.forEach((record) => {
      weighInRecords.push(record);
    });
    res.status(200).json({data: weighInRecords});
  } catch (err) {
    const message = "Could not submit weigh in data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
