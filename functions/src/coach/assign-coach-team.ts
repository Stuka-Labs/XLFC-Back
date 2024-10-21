import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {
  authIsAdmin,
  authIsCoach, authIsSuperAdmin,
} from "../utils/auth-verification-util";
import {
  assignCoachTeam,
  coachOnTeam,
  teamExists,
} from "../utils/manage-team-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  COACH_ALREADY_ON_TEAM_ERROR_MESSAGE,
  COACH_DOESNT_EXIST_ERROR_MESSAGE,
  ERROR_OCCURRED_ASSIGN_COACH_TEAM_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import {coachExists} from "../utils/manage-coach-util";
import {ASSIGN_COACH_TEAM_SUCCESS_MESSAGE} from "../constants/success-message";

export const assignCoachTeamApp = express();

assignCoachTeamApp.use(bodyParser.json());
assignCoachTeamApp.use(cors({origin: true}));
assignCoachTeamApp.use(getUserCredentialsMiddleware);

assignCoachTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Assign Coach Team Function");

  try {
    let coachUid = "";
    if (await authIsCoach(req)) coachUid = req["uid"];
    else if (await authIsAdmin(req) ||
        await authIsSuperAdmin(req)) coachUid = req.body.coachUid;
    else {
      const message = ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE;
      functions.logger.info(message);
      res.status(403).json({message: message});
      return;
    }
    const teamUid = req.body.teamUid;
    // Checks to see if team exists
    if (!(await teamExists(teamUid))) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: TEAM_DOESNT_EXIST_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Checks to see if coach exists
    if (!(await coachExists(coachUid))) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: COACH_DOESNT_EXIST_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Checks to see if coach already exists in the team provided.
    if (await coachOnTeam(coachUid, teamUid)) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: COACH_ALREADY_ON_TEAM_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    const result = await assignCoachTeam(coachUid, teamUid);
    // Checks to see if coach was successfully assigned to team
    if (result) {
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: ASSIGN_COACH_TEAM_SUCCESS_MESSAGE,
        data: {coachUid: coachUid, teamUid: teamUid},
      };
      functions.logger.info(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
      return;
    } else {
      const errorResponse: ErrorResponse = {
        statusCode: 500,
        message: ERROR_OCCURRED_ASSIGN_COACH_TEAM_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_ASSIGN_COACH_TEAM_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
