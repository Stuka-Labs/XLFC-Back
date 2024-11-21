import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsPlayer} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_ASSIGN_PLAYER_TEAM_ERROR_MESSAGE,
  PLAYER_ALREADY_ON_TEAM_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import {playerOnAnyTeam, teamExists} from "../utils/manage-team-util";
import {ASSIGN_PLAYER_TEAM_SUCCESS_MESSAGE} from "../constants/success-message";

export const assignPlayerTeamApp = express();

assignPlayerTeamApp.use(bodyParser.json());
assignPlayerTeamApp.use(cors({origin: true}));
assignPlayerTeamApp.use(getUserCredentialsMiddleware);

assignPlayerTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Assign Player Team Function");

  try {
    if (await authIsPlayer(req)) {
      const userId = req["uid"];
      const teamId = req.body.teamId;

      if (!(await teamExists(teamId))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: TEAM_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      // Ensures player isn't on any team yet
      if (await playerOnAnyTeam(userId)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: PLAYER_ALREADY_ON_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const result = await db.doc(`players/${userId}`).set({
        teamId: teamId,
        startWeight: 0,
        height: 0,
        startBmi: 0,
      });

      if (!result) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_ASSIGN_PLAYER_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: ASSIGN_PLAYER_TEAM_SUCCESS_MESSAGE,
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
      message: ERROR_OCCURRED_ASSIGN_PLAYER_TEAM_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
