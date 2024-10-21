import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {authIsCoach, authIsUser} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_IS_COACH_ERROR_MESSAGE,
} from "../constants/error-message";
import {IS_COACH_SUCCESS_MESSAGE} from "../constants/success-message";

export const IsCoachApp = express();

IsCoachApp.use(bodyParser.json());
IsCoachApp.use(cors({origin: true}));
IsCoachApp.use(getUserCredentialsMiddleware);

// Determine whether a given user is a coach or not.
IsCoachApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Is Coach Function");
  try {
    if (!(await authIsUser(req))) {
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    const successResponse: SuccessResponse = {
      statusCode: 200,
      message: IS_COACH_SUCCESS_MESSAGE,
      data: false,
    };
    if (await authIsCoach(req)) {
      successResponse.data = true;
    }
    functions.logger.log(successResponse);
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_IS_COACH_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
