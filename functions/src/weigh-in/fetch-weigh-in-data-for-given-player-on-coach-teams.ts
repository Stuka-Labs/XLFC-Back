import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export const FetchWeighInDataForGivenPlayerOnCoachTeamsApp = express();

FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(bodyParser.json());
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(cors({origin: true}));
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data for Given Player On Coaches Team Function");
  try {
    if (!(req["uid"])) {
      const message = "Access Denied For Fetch Weigh in Data " +
        "For Given Player On Coaches Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const uid = req["uid"];
    const coachRef = db.collection("coaches").doc(uid);
    const coach = await coachRef.get();
    if (!coach.exists) {
      const message = "Access Denied For Fetch Weigh In Data " +
        "For Coaches Teams Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamIds: [string] = coach.data()?.teamIds;
    const teamIdRefs: DocumentReference<DocumentData, DocumentData>[] = [];
    teamIds.forEach((teamId) => {
      const teamIdRef = db.collection("teams").doc(teamId);
      teamIdRefs.push(teamIdRef);
    });
    const playersSnapshot = await db.collection("players")
      .where("teamIdRef", "in", teamIdRefs).get();
    if (playersSnapshot.empty) {
      const data = [];
      res.status(200).json({data: data});
      return;
    }
    const playerRefs: DocumentReference<DocumentData, DocumentData>[] = [];
    playersSnapshot.forEach((record) => {
      const playerRef = db.collection("players").doc(record.id);
      playerRefs.push(playerRef);
    });
    const playerId = req.query.playerId as string;
    const playerRef = db.collection("players").doc(playerId);
    if (!playerRefs.includes(playerRef)) {
      const message = "Player not found on coaches teams";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const queryWeighInDataSnapshot = await db.collection("weightLog")
      .where("playerRef", "==", playerRef)
      .get();
    if (queryWeighInDataSnapshot.empty) {
      const data = [];
      res.status(200).json({data: data});
      return;
    }
    const weighInRecords
      : QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
    queryWeighInDataSnapshot.forEach((record) => {
      weighInRecords.push(record);
    });
    res.status(200).json({data: weighInRecords});
  } catch (err) {
    const message = "Could not fetch weigh in data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
