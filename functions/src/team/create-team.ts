import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {authIsAdmin, authIsSuperAdmin} from "../utils/auth-verification-util";
import {coachExists} from "../utils/manage-coach-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  COACH_DOESNT_EXIST_ERROR_MESSAGE,
  ERROR_OCCURED_NOT_A_VALID_IMAGE_TYPE,
  ERROR_OCCURRED_CREATE_TEAM_ERROR_MESSAGE,
  INVALID_TEAM_DESCRIPTION_WITHIN_BODY_ERROR_MESSAGE,
  INVALID_TEAM_NAME_WITHIN_BODY_ERROR_MESSAGE,
} from "../constants/error-message";
import {
  validateAlphabeticString,
  validateImageFormat,
} from "../utils/validation-util";
import {db} from "../init";
import {CREATE_TEAM_SUCCESS_MESSAGE} from "../constants/success-message";
import {uploadImage} from "../utils/upload-image-util";

export const createTeamApp = express();

createTeamApp.use(bodyParser.json());
createTeamApp.use(cors({origin: true}));
createTeamApp.use(getUserCredentialsMiddleware);

// Create Team
createTeamApp.post("/", async (req, res) => {
  functions.logger.debug("Calling Create Team Function");

  try {
    if ((await authIsAdmin(req)) || (await authIsSuperAdmin(req))) {
      const teamName: string = req.body.teamName;
      const coachUid: string = req.body.coachUid;
      const teamDescription: string = req.body.teamDescription;
      const teamLogo: { data: string; format: string; contentType: string } =
        req.body.teamLogo;

      // Validate team name and description
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
      if (coachUid && !(await coachExists(coachUid))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: COACH_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      // Upload team logo if provided
      let imageUrl = "";
      if (teamLogo) {
        const format = teamLogo.format;

        // validate format before storing image
        if (!validateImageFormat(format)) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_NOT_A_VALID_IMAGE_TYPE,
          };
          res.status(errorResponse.statusCode).send(errorResponse);
          return;
        }

        imageUrl = await uploadImage(teamLogo);
      }

      const result = await db.collection("teams").doc().set({
        name: teamName,
        coachId: coachUid,
        teamDescription: teamDescription,
        active: true,
        logo: imageUrl,
      });

      if (!result) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_CREATE_TEAM_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: CREATE_TEAM_SUCCESS_MESSAGE,
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
      return;
    }
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_CREATE_TEAM_ERROR_MESSAGE,
    };
    functions.logger.debug(errorResponse);
    res.status(errorResponse.statusCode).json(errorResponse);
    return;
  }
});
