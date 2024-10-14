import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsAdmin} from "../utils/auth-verification-util";

export const archiveSeasonApp = express();

archiveSeasonApp.use(bodyParser.json());
archiveSeasonApp.use(cors({origin: true}));
archiveSeasonApp.use(getUserCredentialsMiddleware);

// Create Team
archiveSeasonApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Archive season Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Archive Season Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const seasonUid = req.body.seasonUid;
    if (!seasonUid) {
      const message = "Invalid seasonUid";
      functions.logger.debug(message);
      res.status(400).json({message: message});
      return;
    }
    const season = await db.collection("seasons").doc(seasonUid).get();
    db.collection("seasons").doc(seasonUid).set({
      archived: true,
      season: season.data()?.season,
      year: season.data()?.year,
    });
    res.status(200)
      .json({message: "Season Archived Successfully"});
  } catch (err) {
    const message = "Could not Archive Season.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
