import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { db } from "../init";
import { firestore } from "firebase-admin";
import DocumentData = firestore.DocumentData;
import { authIsCoach } from "../utils/auth-verification-util";
import { ErrorResponse, SuccessResponse } from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_ERROR_MESSAGE,
  NO_TEAMS_FOUND_FOR_COACH_ERROR_MESSAGE,
} from "../constants/error-message";
import { FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_SUCCESS_MESSAGE } from "../constants/success-message";

export const FetchWeighInDataForCoachTeamsApp = express();

FetchWeighInDataForCoachTeamsApp.use(bodyParser.json());
FetchWeighInDataForCoachTeamsApp.use(cors({ origin: true }));
FetchWeighInDataForCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh-in data for all players in every team that the coach manages
FetchWeighInDataForCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug("Calling Fetch Weigh In Data Coach Teams Function");

  try {
    if (await authIsCoach(req)) {
      const uid = req["uid"];
      const coachRef = db.collection("coaches").doc(uid);
      const coach = await coachRef.get();
      const teamIds: string[] = coach.data()?.teamIds || [];

      if (teamIds.length === 0) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: NO_TEAMS_FOUND_FOR_COACH_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const allPlayerWeighInData: any[] = [];

      for (const teamId of teamIds) {
        // Fetch players for each team
        const playersSnapshot = await db
          .collection("players")
          .where("teamId", "==", teamId)
          .get();

        if (playersSnapshot.empty) continue;

        // For each player, fetch weigh-in data
        for (const playerDoc of playersSnapshot.docs) {
          const playerData = playerDoc.data();
          const playerId = playerDoc.id;

          const weighInDataSnapshot = await db
            .collection("weightLog")
            .where("playerId", "==", playerId)
            .get();

          const weighInRecords: DocumentData[] = [];
          weighInDataSnapshot.forEach((record) => {
            weighInRecords.push({
              id: record.id,
              ...record.data(),
            });
          });

          allPlayerWeighInData.push({
            playerId: playerId,
            teamId: playerData.teamId,
            standardPoints: playerData.standardPoints || 0,
            bonusPoints: playerData.bonusPoints || 0,
            weighInData: weighInRecords,
            weightChange: playerData?.weightChange,
          });
        }
      }

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_SUCCESS_MESSAGE,
        data: allPlayerWeighInData,
      };
      functions.logger.debug(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
    } else {
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
