import express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {db} from "../init";
import {authIsUser} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE, BECOME_COACH_REQUEST_ALREADY_EXISTS_ERROR_MESSAGE,
  ERROR_OCCURRED_BECOME_COACH_ERROR_MESSAGE,
} from "../constants/error-message";
import {BECOME_COACH_SUCCESS_MESSAGE} from "../constants/success-message";
import {becomeCoachRequestExists} from "../utils/manage-coach-util";

export const becomeCoachApp = express();

becomeCoachApp.use(bodyParser.json());
becomeCoachApp.use(cors({origin: true}));
becomeCoachApp.use(getUserCredentialsMiddleware);

becomeCoachApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Become Coach Function");

  try {
    if (await authIsUser(req)) {
      const userUid: string = req["uid"];
      if (await becomeCoachRequestExists(userUid)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: BECOME_COACH_REQUEST_ALREADY_EXISTS_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const result = await db.collection("becomeCoachRequests").doc().set({
        userUid: userUid,
        approved: false,
        reviewed: false,
      });
      if (!result) {
        const errorResponse: ErrorResponse = {
          statusCode: 500,
          message: ERROR_OCCURRED_BECOME_COACH_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: BECOME_COACH_SUCCESS_MESSAGE,
        data: undefined,
      };
      functions.logger.debug(successResponse);
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
      message: ERROR_OCCURRED_BECOME_COACH_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
