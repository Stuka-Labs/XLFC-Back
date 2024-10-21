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
  ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_ERROR_MESSAGE,
  NO_PLAYER_WEIGH_IN_DATA_FOUND_FOR_TEAM_ERROR_MESSAGE,
  NO_PLAYERS_FOUND_FOR_TEAM_ERROR_MESSAGE,
} from "../constants/error-message";
import {
  FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const FetchWeighInDataForCoachTeamsApp = express();

FetchWeighInDataForCoachTeamsApp.use(bodyParser.json());
FetchWeighInDataForCoachTeamsApp.use(cors({origin: true}));
FetchWeighInDataForCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for Coaches Teams
FetchWeighInDataForCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data for Coaches Teams Function");

  try {
    if (await authIsCoach(req)) {
      const uid = req["uid"];
      const coachRef = db.collection("coaches").doc(uid);
      const coach = await coachRef.get();
      const teamIds: [string] = coach.data()?.teamIds;
      const playersSnapshot = await db.collection("players")
        .where("teamId", "in", teamIds).get();

      if (playersSnapshot.empty) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: NO_PLAYERS_FOUND_FOR_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const playerIds: string[] = [];
      playersSnapshot.forEach((player) => {
        playerIds.push(player.id);
      });

      const queryWeighInDataSnapshot = await db.collection("weightLog")
        .where("playerId", "in", playerIds)
        .get();
      if (queryWeighInDataSnapshot.empty) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: NO_PLAYER_WEIGH_IN_DATA_FOUND_FOR_TEAM_ERROR_MESSAGE,
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
        message: FETCH_WEIGH_IN_DATA_FOR_COACH_TEAMS_SUCCESS_MESSAGE,
        data: weighInRecords,
      };
      functions.logger.info(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
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
