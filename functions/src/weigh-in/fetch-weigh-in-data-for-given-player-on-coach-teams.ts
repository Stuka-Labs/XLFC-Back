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
  // eslint-disable-next-line max-len
  ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_ERROR_MESSAGE,
  ERROR_OCCURRED_NO_PLAYERS_FOUND_ERROR_MESSAGE,
  ERROR_OCCURRED_PLAYER_ID_MISSING,
} from "../constants/error-message";
// eslint-disable-next-line max-len
import { FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_SUCCESS_MESSAGE } from "../constants/success-message";

export const FetchWeighInDataForGivenPlayerOnCoachTeamsApp = express();

FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(bodyParser.json());
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(cors({ origin: true }));
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh-in data for a specific player on the coach's team
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data for Specific Player On Coach's Team Function"
  );

  try {
    if (await authIsCoach(req)) {
      const uid = req["uid"];
      const coachRef = db.collection("coaches").doc(uid);
      const coach = await coachRef.get();
      const teamIds: [string] = coach.data()?.teamIds;

      const { playerId } = req.query as { playerId: string };

      if (!playerId) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_PLAYER_ID_MISSING,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      // Verify that the specified player belongs to the coach's team
      const playerSnapshot = await db.collection("players").doc(playerId).get();

      if (
        !playerSnapshot.exists ||
        !teamIds.includes(playerSnapshot.data()?.teamId)
      ) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_NO_PLAYERS_FOUND_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const playerData = playerSnapshot.data();

      // Fetch weigh-in data for the specific player
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

      const playerWeighInData = {
        playerId: playerId,
        teamId: playerData?.teamId,
        standardPoints: playerData?.standardPoints || 0,
        bonusPoints: playerData?.bonusPoints || 0,
        weighInData: weighInRecords,
        weightChange: playerData?.weightChange,
      };

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message:
          FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_SUCCESS_MESSAGE,
        data: playerWeighInData,
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
      message:
        // eslint-disable-next-line max-len
        ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
