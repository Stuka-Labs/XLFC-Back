import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsAdmin, authIsSuperAdmin} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_CREATE_SEASON_ERROR_MESSAGE, ERROR_OCCURRED_SEASON_CURRENTLY_IN_PROGRESS_ERROR_MESSAGE,
} from "../constants/error-message";
import {getLatestSeasonInProgress, getSeasonArchivedLast, isSeasonInProgress} from "../utils/season-util";
import {CREATE_SEASON_SUCCESS_MESSAGE} from "../constants/success-message";

export const createSeasonApp = express();

createSeasonApp.use(bodyParser.json());
createSeasonApp.use(cors({origin: true}));
createSeasonApp.use(getUserCredentialsMiddleware);

// Create Team
createSeasonApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create season Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Create Season Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      if (await isSeasonInProgress()) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_SEASON_CURRENTLY_IN_PROGRESS_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const latestArchivedSeason = await getSeasonArchivedLast();
      if (!latestArchivedSeason) {
        const today = new Date();
        const year = today.getFullYear();
        await db.collection("seasons").doc().set({
          archived: false,
          season: 1,
          year: year,
        });
      } else {
        const lastSeason = latestArchivedSeason.season;
        const lastYear = lastSeason.year;
        const today = new Date();
        const currentYear = today.getFullYear();
        let season = 1;
        if (lastSeason == 1 && lastYear == currentYear) {
          season = 2;
        }
        await db.collection("seasons").doc().set({
          archived: false,
          season: season,
          year: currentYear,
        });
      }
      const latestSeason = await getLatestSeasonInProgress();
      if (!latestSeason) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_CREATE_SEASON_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: CREATE_SEASON_SUCCESS_MESSAGE,
        data: latestSeason,
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
      message: ERROR_OCCURRED_CREATE_SEASON_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
