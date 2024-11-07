import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { db } from "../init";
import { authIsCoach } from "../utils/auth-verification-util";
import { ErrorResponse } from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURED_ALL_WEIGH_IN_FIELDS_REQUIRED,
  ERROR_OCCURED_NOT_A_VALID_BOOLEAN_FIELD,
  ERROR_OCCURED_NOT_A_VALID_MONTH,
  ERROR_OCCURED_NOT_A_VALID_WEEK,
  ERROR_OCCURED_NOT_A_VALID_WEIGHT,
  ERROR_OCCURED_WEIGH_IN_DATA_SUBMISSION,
  ERROR_OCCURRED_NOT_COACH_OF_PLAYERS_TEAM_ERROR_MESSAGE,
  ERROR_OCCURRED_PLAYER_DOESNT_EXIST_ERROR_MESSAGE,
  ERROR_OCCURRED_SEASON_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import { playerExists } from "../utils/manage-team-util";
import { seasonExists } from "../utils/season-util";
import {
  validateIsBoolean,
  validateMonth,
  validateWeek,
  validateWeight,
} from "../utils/validation-util";
import { PLAYER_WEIGH_IN_DATA_SUBMITTED } from "../constants/success-message";
import {
  calculateBonusPoints,
  calculateStandardPoints,
  getRecentWeighLogEntry,
} from "../utils/manage-weighin-util";
import { FieldValue } from "firebase-admin/firestore";
export const SaveWeighInDataApp = express();

SaveWeighInDataApp.use(bodyParser.json());
SaveWeighInDataApp.use(cors({ origin: true }));
SaveWeighInDataApp.use(getUserCredentialsMiddleware);

// Save Weigh In Data
SaveWeighInDataApp.post("/", async (req, res) => {
  functions.logger.debug("Calling Save Weigh In Data Function");

  try {
    if (await authIsCoach(req)) {
      const uid = req["uid"];
      const coach = await db.collection("coaches").doc(uid).get();
      const coachTeamIds: [string] = coach.data()?.teamIds;
      const playerId = req.body.playerId;
      if (await playerExists(playerId)) {
        const playerRef = db.collection("players").doc(playerId);
        const player = await playerRef.get();
        const playerData = player.data();
        const playerTeamId = playerData?.teamId;
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
        const {
          month,
          week,
          weight,
          dailyFoodDiaryComplete,
          weeklyStepsComplete,
          parkRunParticipationComplete,
        } = req.body;

        /* 
        We will do validation on weigh-in data coming from req.body
        before storing it in db
        */

        // making sure all the fields in req body are present
        if (
          !month ||
          !week ||
          !weight ||
          dailyFoodDiaryComplete == null ||
          weeklyStepsComplete == null ||
          parkRunParticipationComplete == null
        ) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_ALL_WEIGH_IN_FIELDS_REQUIRED,
          };
          functions.logger.debug(errorResponse);
          res.status(400).json(errorResponse);
          return;
        }

        if (!validateMonth(month)) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_NOT_A_VALID_MONTH,
          };
          functions.logger.debug(errorResponse);
          res.status(400).json(errorResponse);
          return;
        }

        if (!validateWeek(week)) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_NOT_A_VALID_WEEK,
          };
          functions.logger.debug(errorResponse);
          res.status(400).json(errorResponse);
          return;
        }

        if (!validateWeight(weight)) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_NOT_A_VALID_WEIGHT,
          };
          functions.logger.debug(errorResponse);
          res.status(400).json(errorResponse);
          return;
        }

        if (
          !validateIsBoolean(dailyFoodDiaryComplete) ||
          !validateIsBoolean(weeklyStepsComplete) ||
          !validateIsBoolean(parkRunParticipationComplete)
        ) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_NOT_A_VALID_BOOLEAN_FIELD,
          };
          functions.logger.debug(errorResponse);
          res.status(400).json(errorResponse);
          return;
        }

        // Get the latest weight entry to determine the streak type and length
        const latestEntrySnapshot = await getRecentWeighLogEntry(playerId);

        let newStreakType: "gain" | "loss" =
          weight < playerData?.startWeight ? "loss" : "gain";
        let newStreakLength = 1; // Start a new streak by default

        if (!latestEntrySnapshot.empty) {
          const latestEntry = latestEntrySnapshot.docs[0].data();
          const previousWeight = latestEntry.weight;

          // Determine the streak type based on the new weight
          if (weight > previousWeight) {
            newStreakType = "gain";
          } else if (weight < previousWeight) {
            newStreakType = "loss";
          }

          // Check if we are continuing the same streak
          if (newStreakType === latestEntry.streakType) {
            newStreakLength = latestEntry.streakLength + 1;
          }
        }

        // Save the new weight entry with streak data
        await db.collection("weightLog").add({
          seasonId: seasonId,
          playerId: playerId,
          month: month,
          week: week,
          weight: weight,
          dailyFoodDiaryComplete: dailyFoodDiaryComplete,
          weeklyStepsCompleted: weeklyStepsComplete,
          parkRunParticipationCompleted: parkRunParticipationComplete,
          timestamp: FieldValue.serverTimestamp(),
          streakType: newStreakType,
          streakLength: newStreakLength,
        });

        // Score Calculation
        const standardPoints = calculateStandardPoints(
          playerData?.startWeight,
          weight
        );

        const bonusPoints = await calculateBonusPoints(
          { playerId: playerId, ...playerData },
          weight
        );

        // Now update player standard & bonus points
        await playerRef.update({
          standardPoints: playerData?.standardPoints + standardPoints,
          bonusPoints: playerData?.bonusPoints + bonusPoints,
          weightChange: Math.abs(playerData?.startWeight - weight),
        });

        res.status(200).json({ message: PLAYER_WEIGH_IN_DATA_SUBMITTED });
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
    const message = ERROR_OCCURED_WEIGH_IN_DATA_SUBMISSION;
    functions.logger.error(message, err);
    res.status(500).json({ message: message });
  }
});
