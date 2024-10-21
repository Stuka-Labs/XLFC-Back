import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsCoach, authIsUser} from "../utils/auth-verification-util";
import {ErrorResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_NOT_COACH_OF_PLAYERS_TEAM_ERROR_MESSAGE,
  ERROR_OCCURRED_PLAYER_DOESNT_EXIST_ERROR_MESSAGE,
  ERROR_OCCURRED_SEASON_DOESNT_EXIST_ERROR_MESSAGE
} from "../constants/error-message";
import {playerExists} from "../utils/manage-team-util";
import {seasonExists} from "../utils/season-util";

export const SaveWeighInDataApp = express();

SaveWeighInDataApp.use(bodyParser.json());
SaveWeighInDataApp.use(cors({origin: true}));
SaveWeighInDataApp.use(getUserCredentialsMiddleware);

// Save Weigh In Data
SaveWeighInDataApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Save Weigh In Data Function");

  try {
    if (await authIsCoach(req)) {
      const uid = req["uid"];
      const coach = await db.collection("coaches").doc(uid).get();
      const coachTeamIds: [string] = coach.data()?.teamIds;
      const playerId = req.body.playerId;
      if (await playerExists(playerId)) {
        const player = await db.collection("players").doc(playerId).get();
        const playerTeamId = player.data()?.teamId;
        if (!coachTeamIds.includes(playerTeamId)) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURRED_NOT_COACH_OF_PLAYERS_TEAM_ERROR_MESSAGE,
          };
          functions.logger.debug(errorResponse);
          res.status(errorResponse.statusCode).json(errorResponse);
          return;
        }

        const seasonId: string = req.body.seasonId;
        if (!(await seasonExists(seasonId))) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURRED_SEASON_DOESNT_EXIST_ERROR_MESSAGE,
          };
          functions.logger.debug(errorResponse);
          res.status(errorResponse.statusCode).json(errorResponse);
          return;
        }
        // TODO: CONTINUE HERE, ADD VALIDATION TO WEIGH IN DATA SAVING.
        const month: number = req.body.month;
        const week: number = req.body.week;
        const weight: number = req.body.weight;
        const dailyFoodDiaryComplete: boolean = req.body.dailyFoodDiaryComplete;
        const weeklyStepsCompleted: boolean = req.body.weeklyStepsComplete;
        const parkRunParticipationCompleted: boolean = req.body.parkRunParticipationComplete;
        await db.collection("weightLog").doc().set({
          seasonId: seasonId,
          playerId: playerId,
          month: month,
          week: week,
          weight: weight,
          dailyFoodDiaryComplete: dailyFoodDiaryComplete,
          weeklyStepsCompleted: weeklyStepsCompleted,
          parkRunParticipationCompleted: parkRunParticipationCompleted,
        });
        res.status(200)
          .json({message: "Player Weigh In Data Submitted Successfully"});
      } else {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_PLAYER_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
      }
    } else {
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  } catch (err) {
    const message = "Could not submit weigh in data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
