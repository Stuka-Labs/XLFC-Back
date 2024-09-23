import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";

export const FetchWeighInDataForLoggedInUserApp = express();

FetchWeighInDataForLoggedInUserApp.use(bodyParser.json());
FetchWeighInDataForLoggedInUserApp.use(cors({origin: true}));
FetchWeighInDataForLoggedInUserApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for logged-in user
FetchWeighInDataForLoggedInUserApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data Function");

  try {
    if (!(req["uid"])) {
      const message = "Access Denied For Submit Weight In Data Service";
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
