import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import DocumentData = firestore.DocumentData;
import {authIsPlayer} from "../utils/auth-verification-util";

export const FetchWeighInDataForLoggedInUserApp = express();

FetchWeighInDataForLoggedInUserApp.use(bodyParser.json());
FetchWeighInDataForLoggedInUserApp.use(cors({origin: true}));
FetchWeighInDataForLoggedInUserApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for logged-in user
FetchWeighInDataForLoggedInUserApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data Function");

  try {
    if (!(authIsPlayer(req))) {
      const message = "Access Denied For Fetching Weigh In" +
        " Data For Logged In User Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const uid = req["uid"];
    const playerRef = db.collection("players").doc(uid);
    const queryWeighInDataSnapshot = await db.collection("weightLog")
      .where("playerRef", "==", playerRef)
      .get();
    if (queryWeighInDataSnapshot.empty) {
      const data = [];
      res.status(200).json({data: data});
      return;
    }
    const weighInRecords
      : QueryDocumentSnapshot<DocumentData, DocumentData>[]= [];
    queryWeighInDataSnapshot.forEach((record) => {
      weighInRecords.push(record);
    });
    res.status(200).json({data: weighInRecords});
  } catch (err) {
    const message = "Could Not Fetch Weigh In Data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
