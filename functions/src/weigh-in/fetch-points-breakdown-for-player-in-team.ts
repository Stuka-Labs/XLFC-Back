import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { db } from "../init";
import { firestore } from "firebase-admin";
import DocumentData = firestore.DocumentData;
import { ErrorResponse, SuccessResponse } from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_LOGGED_IN_USER_ERROR_MESSAGE,
  ERROR_OCCURRED_NO_PLAYER_WEIGH_IN_DATA_FOUND_ERROR_MESSAGE,
} from "../constants/error-message";
import { authIsPlayer } from "../utils/auth-verification-util";

// eslint-disable-next-line max-len
import { POINTS_BREAKDOWN_FETCHED_FOR_PLAYER } from "../constants/success-message";

export const FetchPointsBreakDownForPlayerInTeam = express();
FetchPointsBreakDownForPlayerInTeam.use(bodyParser.json());
FetchPointsBreakDownForPlayerInTeam.use(cors({ origin: true }));
FetchPointsBreakDownForPlayerInTeam.use(getUserCredentialsMiddleware);

// Fetch only week and points for the logged-in player's weigh-in data
FetchPointsBreakDownForPlayerInTeam.get("/", async (req, res) => {
  functions.logger.debug("Calling Fetch Weigh In Week and Points Function");

  try {
    // Check if the user is a player
    if (await authIsPlayer(req)) {
      const uid = req["uid"];

      // Query the weightLog collection for entries matching the player's UID
      const weighInDataSnapshot = await db
        .collection("weightLog")
        .where("playerId", "==", uid)
        .select("week", "points")
        .get();

      if (weighInDataSnapshot.empty) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_NO_PLAYER_WEIGH_IN_DATA_FOUND_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const weighInRecords: DocumentData[] = [];
      weighInDataSnapshot.forEach((record) => {
        weighInRecords.push({
          id: record.id,
          week: record.get("week"),
          points: record.get("points"),
        });
      });

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: POINTS_BREAKDOWN_FETCHED_FOR_PLAYER,
        data: weighInRecords,
      };
      functions.logger.info(successResponse);
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
        ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_LOGGED_IN_USER_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
