import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {auth, db} from "../init";
import {authIsUser} from "../utils/auth-verification-util";

export const assignCoachApp = express();

assignCoachApp.use(bodyParser.json());
assignCoachApp.use(cors({origin: true}));
assignCoachApp.use(getUserCredentialsMiddleware);

assignCoachApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Assign Coach Function");
  try {
    // if (!(authIsAdmin(req))) {
    if (!(authIsUser(req))) {
      const message = "Access Denied For Assign User As Coach Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }

    // const userUid = req.body.userUid;
    await db.doc(`coaches/${req['uid']}`).set({
      teamIds: [],
    });
    await auth.setCustomUserClaims(req['uid'], {coach: true});

    res.status(200).json({message: "User Assigned Coach Successfully"});
  } catch (err) {
    const message = "Could not assign user as coach";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
