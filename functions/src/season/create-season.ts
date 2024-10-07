import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsAdmin} from "../utils/auth-verification-util";

export const createSeasonApp = express();

createSeasonApp.use(bodyParser.json());
createSeasonApp.use(cors({origin: true}));
createSeasonApp.use(getUserCredentialsMiddleware);

// Create Team
createSeasonApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create season Function");

  try {
    if (!(await authIsAdmin(req))) {
      const message = "Access Denied For Create Season Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const season = req.body.season;
    const year = req.body.year;
    if (!season) {
      const message = "Invalid season";
      functions.logger.debug(message);
      res.status(400).json({message: message});
      return;
    }
    if (!year) {
      const message = "Invalid Year";
      functions.logger.debug(message);
      res.status(400).json({message: message});
      return;
    }

    await db.collection("seasons").doc().set({
      archived: false,
      season: season,
      year: year,
    });
    res.status(200)
      .json({message: "Season Created Successfully"});
  } catch (err) {
    const message = "Could not Create Season.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
