import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {auth, db} from "../init";
import {authIsAdmin, authIsSuperAdmin} from "../utils/auth-verification-util";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE, COACH_ALREADY_EXISTS_ERROR_MESSAGE,
  ERROR_OCCURRED_ASSIGN_COACH_MESSAGE,
  INVALID_USER_UID_WITHIN_BODY_ERROR_MESSAGE,
} from "../constants/error-message";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {ASSIGN_COACH_SUCCESS_MESSAGE} from "../constants/success-message";
import {coachExists} from "../utils/manage-coach-util";

export const assignCoachApp = express();

assignCoachApp.use(bodyParser.json());
assignCoachApp.use(cors({origin: true}));
assignCoachApp.use(getUserCredentialsMiddleware);

assignCoachApp.post("/", async (req, res) => {
  functions.logger.info(
    "Calling Assign Coach Function");
  try {
    if (!((await authIsAdmin(req)) || (await authIsSuperAdmin(req)))) {
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }

    const userUid: string = req.body.userUid;
    if (!userUid) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: INVALID_USER_UID_WITHIN_BODY_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    if (await coachExists(userUid)) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: COACH_ALREADY_EXISTS_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    await db.doc(`coaches/${userUid}`).set({
      teamIds: [],
    });
    await auth.setCustomUserClaims(userUid, {coach: true});

    const successResponse: SuccessResponse = {
      statusCode: 200,
      message: ASSIGN_COACH_SUCCESS_MESSAGE,
      data: userUid,
    };
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_ASSIGN_COACH_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
