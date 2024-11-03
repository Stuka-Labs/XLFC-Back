import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { authIsAdmin, authIsSuperAdmin } from "../utils/auth-verification-util";
import { coachExists } from "../utils/manage-coach-util";
import { ErrorResponse, SuccessResponse } from "../models/custom-responses";
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
import { v4 as uuidv4 } from "uuid";
import { db, bucket } from "../init";
import { CREATE_TEAM_SUCCESS_MESSAGE } from "../constants/success-message";

export const createTeamApp = express();

createTeamApp.use(bodyParser.json());
createTeamApp.use(cors({ origin: true }));
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
        const uuid = uuidv4();
        const buffer = Buffer.from(teamLogo.data.split(",")[1], "base64"); // Decode base64 image
        const format = teamLogo.format;

        // validate format before storing image
        if (!validateImageFormat(format)) {
          const errorResponse: ErrorResponse = {
            statusCode: 400,
            message: ERROR_OCCURED_NOT_A_VALID_IMAGE_TYPE,
          };
          functions.logger.debug(errorResponse);
          res.status(errorResponse.statusCode).json(errorResponse);
          return;
        }

        const fileName = `users/${uuid}.${teamLogo.format}`; // Use uuid for unique file name
        // Upload buffer to Google Cloud Storage
        const file = bucket.file(fileName);
        await file.save(buffer, {
          metadata: {
            contentType: `image/${teamLogo.format}`,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
          public: true,
        });

        // Generate the download URL
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
      }

      const result = await db
        .collection("teams")
        .doc()
        .set({
          name: teamName,
          coachId: coachUid,
          teamDescription: teamDescription,
          active: true,
          logo: teamLogo ? imageUrl : "",
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
      message: ERROR_OCCURRED_CREATE_TEAM_ERROR_MESSAGE,
    };
    functions.logger.debug(errorResponse);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
