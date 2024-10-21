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
  ERROR_OCCURRED_ARCHIVE_SEASON_ERROR_MESSAGE,
  NO_ACTIVE_SEASON_ERROR_MESSAGE,
} from "../constants/error-message";
import {getLatestSeasonInProgress} from "../utils/season-util";
import {ARCHIVE_SEASON_SUCCESS_MESSAGE} from "../constants/success-message";

export const archiveSeasonApp = express();

archiveSeasonApp.use(bodyParser.json());
archiveSeasonApp.use(cors({origin: true}));
archiveSeasonApp.use(getUserCredentialsMiddleware);

// Create Team
archiveSeasonApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Archive season Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Archive Season Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      const latestActiveSeason = await getLatestSeasonInProgress();
      if (!latestActiveSeason) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: NO_ACTIVE_SEASON_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const result =
          await db.collection("seasons").doc(latestActiveSeason.id).set({
            archived: true,
            ...latestActiveSeason,
          });

      if (!result) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_ARCHIVE_SEASON_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: ARCHIVE_SEASON_SUCCESS_MESSAGE,
        data: undefined,
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
      message: ERROR_OCCURRED_ARCHIVE_SEASON_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
