import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {teamExists} from "../utils/manage-team-util";
import {authIsAdmin, authIsSuperAdmin} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  COACH_DOESNT_EXIST_ERROR_MESSAGE,
  ERROR_OCCURRED_EDIT_TEAM_ERROR_MESSAGE,
  INVALID_TEAM_DESCRIPTION_WITHIN_BODY_ERROR_MESSAGE,
  INVALID_TEAM_NAME_WITHIN_BODY_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import {validateAlphabeticString} from "../utils/validation-util";
import {EDIT_TEAM_SUCCESS_MESSAGE} from "../constants/success-message";
import {coachExists} from "../utils/manage-coach-util";

export const editTeamApp = express();

editTeamApp.use(bodyParser.json());
editTeamApp.use(cors({origin: true}));
editTeamApp.use(getUserCredentialsMiddleware);

// Create Team
editTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Edit Team Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Edit Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      const teamId = req.body.teamId;
      const teamName = req.body.teamName;
      const coachId = req.body.coachId;
      const teamDescription = req.body.teamDescription;
      if (!(await teamExists(teamId))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: TEAM_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      if (coachId && !(await coachExists(coachId))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: COACH_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      if (!validateAlphabeticString(teamName)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: INVALID_TEAM_NAME_WITHIN_BODY_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      if (!validateAlphabeticString(teamDescription)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: INVALID_TEAM_DESCRIPTION_WITHIN_BODY_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const team = await db.collection("teams").doc(teamId).get();
      const teamData = team.data();
      if (!teamData) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_EDIT_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      await db.collection("teams").doc().set({
        name: teamName,
        coachId: coachId,
        description: teamDescription,
        active: teamData.active,
      });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: EDIT_TEAM_SUCCESS_MESSAGE,
        data: undefined,
      };
      functions.logger.info(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
      return;
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
      message: ERROR_OCCURRED_EDIT_TEAM_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
