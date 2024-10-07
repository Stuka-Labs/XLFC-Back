import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsPlayer} from "../utils/auth-verification-util";

export const EditPlayerInitialDataApp = express();

EditPlayerInitialDataApp.use(bodyParser.json());
EditPlayerInitialDataApp.use(cors({origin: true}));
EditPlayerInitialDataApp.use(getUserCredentialsMiddleware);

// Save Weigh In Data
EditPlayerInitialDataApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Edit Player Initial Data Function");

  try {
    if (!(await authIsPlayer(req))) {
      const message = "Access Denied For Edit Player Initial Data Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const uid = req["uid"];
    const startWeight = req.body.startWeight;
    const height = req.body.height;
    const startBmi = req.body.startBmi;
    const playerRef = db.collection("players").doc(uid);
    const player = await playerRef.get();
    await playerRef.set({
      teamId: player.data()?.teamId,
      startWeight: startWeight,
      height: height,
      startBmi: startBmi,
    });
    res.status(200)
      .json({message: "Player Initial Data Updated Successfully"});
  } catch (err) {
    const message = "Could not Update initial player data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
