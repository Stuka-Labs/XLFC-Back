import express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {db} from "../init";
import {authIsAdmin, authIsSuperAdmin} from "../utils/auth-verification-util";
import {isNonEmptyString} from "firebase-admin/lib/utils/validator";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
  ERROR_OCCURRED_RESPOND_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
  INVALID_APPROVED_FLAG_ERROR_MESSAGE,
  INVALID_REQUEST_ID_ERROR_MESSAGE,
} from "../constants/error-message";
import {
  RESPOND_BECOME_COACH_REQUEST_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const respondBecomeCoachRequestApp = express();

respondBecomeCoachRequestApp.use(bodyParser.json());
respondBecomeCoachRequestApp.use(cors({origin: true}));
respondBecomeCoachRequestApp.use(getUserCredentialsMiddleware);

respondBecomeCoachRequestApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Respond To Become Coach Request Function");
  try {
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      const requestId: string = req.body.requestId;
      const approved: boolean = req.body.approved;
      if (!requestId || !isNonEmptyString(requestId)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: INVALID_REQUEST_ID_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      if (approved == undefined) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: INVALID_APPROVED_FLAG_ERROR_MESSAGE,
        };
        res.status(errorResponse.statusCode).json(errorResponse);
      }
      const becomeCoachRequestRef = db
        .collection("becomeCoachRequests").doc(requestId);
      const becomeCoachRequest = await becomeCoachRequestRef.get();
      if (!becomeCoachRequest.exists) {
        const errorResponse: ErrorResponse = {
          statusCode: 404,
          message:
          ERROR_OCCURRED_FETCH_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const result =
          await db.collection("becomeCoachRequests").doc(requestId).set({
            userRef: becomeCoachRequest.get("userRef"),
            approved: approved,
            reviewed: true,
          });
      if (!result) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message:
          ERROR_OCCURRED_RESPOND_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(500).json(errorResponse);
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: RESPOND_BECOME_COACH_REQUEST_SUCCESS_MESSAGE,
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
      message:
      ERROR_OCCURRED_RESPOND_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
