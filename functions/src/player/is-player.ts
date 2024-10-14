import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {authIsPlayer, authIsUser} from "../utils/auth-verification-util";

export const IsPlayerApp = express();

IsPlayerApp.use(bodyParser.json());
IsPlayerApp.use(cors({origin: true}));
IsPlayerApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
IsPlayerApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Is Player Function");
  try {
    if (!authIsUser(req)) {
      const message = "Access Denied For Is Player Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    let isPlayer = false;
    isPlayer = !!(authIsPlayer(req));
    res.status(200).json({data: isPlayer});
  } catch (err) {
    const message = "Could not determine whether user is player or not. " +
        "Error Occurred.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
