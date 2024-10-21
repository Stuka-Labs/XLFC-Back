import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {authIsUser} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_ALL_TEAMS_ERROR_MESSAGE
} from "../constants/error-message";
import {FETCH_ALL_TEAMS_SUCCESS_MESSAGE} from "../constants/success-message";

export const FetchAllTeamsApp = express();

FetchAllTeamsApp.use(bodyParser.json());
FetchAllTeamsApp.use(cors({origin: true}));
FetchAllTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchAllTeamsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch All Teams Function");
  try {
    if (await authIsUser(req)) {
      const searchQuery = req.query.searchQuery as string;
      if (!searchQuery) {
        const teamsSnapshot = await db
          .collection("teams").where("active", "==", true).get();
        const results: DocumentData[] = [];
        teamsSnapshot.forEach((team) => {
          const data = team.data();
          if (data) {
            results.push({
              ...data,
              id: team.id,
            });
          }
        });
        const successResponse: SuccessResponse = {
          statusCode: 200,
          message: FETCH_ALL_TEAMS_SUCCESS_MESSAGE,
          data: results,
        };
        functions.logger.info(successResponse);
        res.status(successResponse.statusCode).json(successResponse);
      } else {
        const teamsSnapshot = await db
          .collection("teams")
          .orderBy("name")
          .startAt(searchQuery)
          .endAt(searchQuery + "\uf8ff")
          .get();
        const results: DocumentData[] = [];
        teamsSnapshot.forEach((team) => {
          const data: DocumentData = team.data();
          if (data) {
            results.push({
              ...data,
              id: team.id,
            });
          }
        });
        const successResponse: SuccessResponse = {
          statusCode: 200,
          message: FETCH_ALL_TEAMS_SUCCESS_MESSAGE,
          data: results,
        };
        functions.logger.info(successResponse);
        res.status(successResponse.statusCode).json(successResponse);
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
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_FETCH_ALL_TEAMS_ERROR_MESSAGE,
    };
    functions.logger.debug(errorResponse);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
