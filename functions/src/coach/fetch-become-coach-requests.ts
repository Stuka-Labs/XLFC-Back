import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import {authIsAdmin} from "../utils/auth-verification-util";

export const fetchBecomeCoachRequestsApp = express();

fetchBecomeCoachRequestsApp.use(bodyParser.json());
fetchBecomeCoachRequestsApp.use(cors({origin: true}));
fetchBecomeCoachRequestsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for Coaches Teams
fetchBecomeCoachRequestsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Become Coach Requests Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Fetch Become Coach Requests" +
        ". Unauthorized.";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const coachRequestsSnapshot = await db.collection("becomeCoachRequests")
      .where("reviewed", "==", false).get();
    if (coachRequestsSnapshot.empty) {
      const data = [];
      res.status(200).json({data: data});
      return;
    }
    const becomeCoachRequests
      : QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
    coachRequestsSnapshot.forEach((record) => {
      becomeCoachRequests.push(record);
    });
    res.status(200).json({data: becomeCoachRequests});
  } catch (err) {
    const message = "Could not fetch become coach requests.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
