import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {authIsCoach} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  // eslint-disable-next-line max-len
  ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_ERROR_MESSAGE,
  ERROR_OCCURRED_NO_PLAYER_WEIGH_IN_DATA_FOUND_ERROR_MESSAGE,
  ERROR_OCCURRED_NO_PLAYERS_FOUND_ERROR_MESSAGE,
} from "../constants/error-message";
import {
  FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const FetchWeighInDataForGivenPlayerOnCoachTeamsApp = express();

FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(bodyParser.json());
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(cors({origin: true}));
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchWeighInDataForGivenPlayerOnCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data for Given Player On Coaches Team Function");
  try {
    if (await authIsCoach(req)) {
      const uid = req["uid"];
      const coachRef = db.collection("coaches").doc(uid);
      const coach = await coachRef.get();
      const teamIds: [string] = coach.data()?.teamIds;
      const playersSnapshot =
          await db.collection("players").where("teamIds", "in", teamIds).get();
      if (playersSnapshot.empty) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_NO_PLAYERS_FOUND_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const playerIds: string[] = [];
      playersSnapshot.forEach((player) => {
        playerIds.push(player.id);
      });
      const playerId = req.query.playerId as string;
      if (!playerIds.includes(playerId)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_NO_PLAYERS_FOUND_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const queryWeighInDataSnapshot = await db.collection("weightLog")
        .where("playerId", "==", playerId)
        .get();
      if (queryWeighInDataSnapshot.empty) {
        const errorResponse: ErrorResponse = {
          statusCode: 404,
          message: ERROR_OCCURRED_NO_PLAYER_WEIGH_IN_DATA_FOUND_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const weighInRecords: DocumentData[] = [];
      queryWeighInDataSnapshot.forEach((record) => {
        weighInRecords.push({
          ...record,
          id: record.id,
        });
      });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message:
        FETCH_WEIGH_IN_DATA_FOR_GIVEN_PLAYER_ON_COACHES_TEAMS_SUCCESS_MESSAGE,
        data: weighInRecords,
      };
      functions.logger.debug(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
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
