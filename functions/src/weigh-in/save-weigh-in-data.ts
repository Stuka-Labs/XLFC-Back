import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";

export const SaveWeighInDataApp = express();

SaveWeighInDataApp.use(bodyParser.json());
SaveWeighInDataApp.use(cors({origin: true}));
SaveWeighInDataApp.use(getUserCredentialsMiddleware);

// Save Weigh In Data
SaveWeighInDataApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Save Weigh In Data Function");

  try {
    if (!(req["uid"])) {
      const message = "Access Denied For Submit Weight In Data Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const uid = req["uid"];
    const coachRef = db.collection("coaches").doc(uid);
    const coach = await coachRef.get();
    if (!coach.exists) {
      const message = `Could not find a coach with id ${uid}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
    }
    const coachTeamIds: [string] = coach.data()?.teamIds;
    const playerId = await req.body.playerId;
    const playerRef = db.collection("players").doc(playerId);
    const player = await playerRef.get();
    if (!player.exists) {
      const message = "Player with provided id does not exist.";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const playerTeamId = player.data()?.teamId;
    if (!coachTeamIds.includes(playerTeamId)) {
      const message = "You are not the coach of the provided players team. " +
        "Unable to submit weigh in data.";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }

    const seasonId = req.body.seasonId;
    const month = req.body.month;
    const week = req.body.week;
    const weight = req.body.weight;
    const dailyFoodDiaryComplete = req.body.dailyFoodDiaryComplete;
    const weeklyStepsCompleted = req.body.weeklyStepsComplete;
    const parkRunParticipationCompleted = req.body.
      parkRunParticipationComplete;
    const seasonRef = db.collection("seasons").doc(seasonId);
    await db.collection("weightLog").doc().set({
      seasonRef: seasonRef,
      playerRef: playerRef,
      month: month,
      week: week,
      weight: weight,
      dailyFoodDiaryComplete: dailyFoodDiaryComplete,
      weeklyStepsCompleted: weeklyStepsCompleted,
      parkRunParticipationCompleted: parkRunParticipationCompleted,
    });
    res.status(200)
      .json({message: "Player Weigh In Data Submitted Successfully"});
  } catch (err) {
    const message = "Could not submit weigh in data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
