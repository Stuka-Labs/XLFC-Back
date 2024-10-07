import * as express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {db} from "../init";
import {userSignedIn} from "../utils/auth-verification-util";

export const becomeCoachApp = express();

becomeCoachApp.use(bodyParser.json());
becomeCoachApp.use(cors({origin: true}));
becomeCoachApp.use(getUserCredentialsMiddleware);

becomeCoachApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Become Coach Function");

  try {
    if (!(await userSignedIn(req))) {
      const message = "Access Denied For Become Coach Service";
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }
    const userUid = req["uid"];
    const userRef = db.collection("users").doc(userUid);
    await db.collection("becomeCoachRequests").doc().set({
      userRef: userRef,
      approved: false,
      reviewed: false,
    });
    res.status(200).json({
      message: "Request to become a coach submitted successfully",
    });
  } catch (err) {
    const message = "Could not submit request to become a coach";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
