import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {
  authIsAdmin,
  authIsSuperAdmin,
} from "../utils/auth-verification-util";
import {
  coachOnTeam,
  deleteCoachTeam,
  teamExists,
} from "../utils/manage-team-util";
import {coachExists} from "../utils/manage-coach-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  COACH_DOESNT_EXIST_ERROR_MESSAGE,
  COACH_NOT_ON_TEAM_ERROR_MESSAGE,
  ERROR_OCCURRED_DELETE_COACH_TEAM_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import {DELETE_COACH_TEAM_SUCCESS_MESSAGE} from "../constants/success-message";

export const deleteCoachTeamApp = express();

deleteCoachTeamApp.use(bodyParser.json());
deleteCoachTeamApp.use(cors({origin: true}));
deleteCoachTeamApp.use(getUserCredentialsMiddleware);

deleteCoachTeamApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Coach Team Function");
  try {
    // Checking to see if user is admin or super-admin
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      const coachUid = req.body.coachUid;
      const teamUid = req.body.teamUid;
      // Checking to see if coach exists with provided coachUid
      if (!(await coachExists(coachUid))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: COACH_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      // Checking to see if team exists with provided teamUid
      if (!(await teamExists(teamUid))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: TEAM_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      // Checking to see if the coach provided is on the team provided
      if (!(await coachOnTeam(coachUid, teamUid))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: COACH_NOT_ON_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      // Deleting coach from the team
      const result = await deleteCoachTeam(coachUid, teamUid);
      // Checking to see if coach was successfully deleted from team
      if (!result) {
        // If coach couldn't be deleted for an unknown reason.
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_DELETE_COACH_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      // Sending Response that coach was successfully removed
      // from the team provided.
      const successResponse: SuccessResponse = {
        statusCode: 204,
        message: DELETE_COACH_TEAM_SUCCESS_MESSAGE,
        data: undefined,
      };
      functions.logger.info(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
    } else {
      // If the user wasn't an admin or super-admin
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
  } catch (err) {
    // If unknown error occurred.
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_DELETE_COACH_TEAM_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
