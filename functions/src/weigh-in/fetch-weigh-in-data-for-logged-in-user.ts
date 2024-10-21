import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {authIsPlayer} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_LOGGED_IN_USER_ERROR_MESSAGE,
  ERROR_OCCURRED_NO_PLAYER_WEIGH_IN_DATA_FOUND_ERROR_MESSAGE,
} from "../constants/error-message";
import {
  FETCH_WEIGH_IN_DATA_FOR_LOGGED_IN_USER_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const FetchWeighInDataForLoggedInUserApp = express();

FetchWeighInDataForLoggedInUserApp.use(bodyParser.json());
FetchWeighInDataForLoggedInUserApp.use(cors({origin: true}));
FetchWeighInDataForLoggedInUserApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for logged-in user
FetchWeighInDataForLoggedInUserApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Weigh In Data Function");

  try {
    if (await authIsPlayer(req)) {
      const uid = req["uid"];
      const queryWeighInDataSnapshot = await db.collection("weightLog")
        .where("playerId", "==", uid)
        .get();
      if (queryWeighInDataSnapshot.empty) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_NO_PLAYER_WEIGH_IN_DATA_FOUND_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const weighInRecords
          : DocumentData[] = [];
      queryWeighInDataSnapshot.forEach((record) => {
        weighInRecords.push({
          ...record,
          id: record.id,
        });
      });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: FETCH_WEIGH_IN_DATA_FOR_LOGGED_IN_USER_SUCCESS_MESSAGE,
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
      // eslint-disable-next-line max-len
      message: ERROR_OCCURRED_FETCH_WEIGH_IN_DATA_FOR_LOGGED_IN_USER_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
