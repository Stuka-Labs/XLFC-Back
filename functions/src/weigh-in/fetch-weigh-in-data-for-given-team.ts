import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import DocumentData = firestore.DocumentData;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import {authIsUser} from "../utils/auth-verification-util";

export const FetchWeighInDataForGivenTeamApp = express();

FetchWeighInDataForGivenTeamApp.use(bodyParser.json());
FetchWeighInDataForGivenTeamApp.use(cors({origin: true}));
FetchWeighInDataForGivenTeamApp.use(getUserCredentialsMiddleware);

// Fetch all weigh in data for given team
FetchWeighInDataForGivenTeamApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data For Team Function");

  try {
    if (!(authIsUser(req))) {
      const message = "Access Denied For Fetch Weigh " +
        "In Data For Given Team Service";
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
    const playerRefs: DocumentReference<DocumentData, DocumentData>[] = [];
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
