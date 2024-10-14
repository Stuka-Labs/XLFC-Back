import express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {db} from "../init";
import {authIsAdmin} from "../utils/auth-verification-util";

export const respondBecomeCoachRequestApp = express();

respondBecomeCoachRequestApp.use(bodyParser.json());
respondBecomeCoachRequestApp.use(cors({origin: true}));
respondBecomeCoachRequestApp.use(getUserCredentialsMiddleware);

respondBecomeCoachRequestApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Respond To Become Coach Request Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Respond To Become Coach Request " +
        "Service";
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }
    const requestId = req.body.requestId;
    const approved = req.body.approved;
    if (!requestId) {
      res.status(400).json({message: "Invalid Request Id"});
      return;
    }
    if (!approved) {
      res.status(400).json({message: "Approval was invalid."});
    }
    const becomeCoachRequestRef = db
      .collection("becomeCoachRequests").doc(requestId);
    const becomeCoachRequest = await becomeCoachRequestRef.get();
    if (!becomeCoachRequest.exists) {
      const message = "Unable to find coach request with id " + requestId;
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }

    db.collection("becomeCoachRequests").doc(requestId).set({
      userRef: becomeCoachRequest.get("userRef"),
      approved: approved,
      reviewed: true,
    });

    res.status(200)
      .json({message: "Become Coach Request Responded To Successfully"});
  } catch (err) {
    const message = "Could not respond to become coach request";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
