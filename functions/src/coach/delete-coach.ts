import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {
  authIsAdmin,
  authIsSuperAdmin,
} from "../utils/auth-verification-util";
import {coachExists, deleteCoach} from "../utils/manage-coach-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE, COACH_DOESNT_EXIST_ERROR_MESSAGE,
  ERROR_OCCURRED_DELETE_COACH_ERROR_MESSAGE,
} from "../constants/error-message";
import {DELETE_COACH_SUCCESS_MESSAGE} from "../constants/success-message";

export const deleteCoachApp = express();

deleteCoachApp.use(bodyParser.json());
deleteCoachApp.use(cors({origin: true}));
deleteCoachApp.use(getUserCredentialsMiddleware);

deleteCoachApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Coach Team Function");
  try {
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      const coachUid = req.body.coachUid;
      // ensures provided coach exists
      if (!(await coachExists(coachUid))) {
        const errorResponse: ErrorResponse = {
          statusCode: 403,
          message: COACH_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const result = await deleteCoach(coachUid);
      // checks to ensure that coach was successfully deleted
      if (!result) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: ERROR_OCCURRED_DELETE_COACH_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: DELETE_COACH_SUCCESS_MESSAGE,
        data: {coachUid: coachUid},
      };
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
      message: ERROR_OCCURRED_DELETE_COACH_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
