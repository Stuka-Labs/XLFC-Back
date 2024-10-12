import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {authIsCoach} from "../utils/auth-verification-util";

export const IsCoachApp = express();

IsCoachApp.use(bodyParser.json());
IsCoachApp.use(cors({origin: true}));
IsCoachApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
IsCoachApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Is Coach Function");
  try {
    if (!req["uid"]) {
      const message = "Access Denied For Is Coach Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    let isCoach = false;
    isCoach = !!(authIsCoach(req));
    res.status(200).json({data: isCoach});
  } catch (err) {
    const message = "Could not determine whether user is coach or not. " +
        "Error Occurred.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
