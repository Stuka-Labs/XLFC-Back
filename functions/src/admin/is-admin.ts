import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {authIsAdmin, authIsUser} from "../utils/auth-verification-util";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_IS_ADMIN_ERROR_MESSAGE,
} from "../constants/error-message";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {IS_ADMIN_SUCCESS_MESSAGE} from "../constants/success-message";

export const IsAdminApp = express();

IsAdminApp.use(bodyParser.json());
IsAdminApp.use(cors({origin: true}));
IsAdminApp.use(getUserCredentialsMiddleware);

/**
 * Determines whether the logged-in user is an admin for the frontend or not.
 */
IsAdminApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Is Admin Function");
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

    const isAdmin = (await authIsAdmin(req));
    const successResponse: SuccessResponse = {
      statusCode: 200,
      message: IS_ADMIN_SUCCESS_MESSAGE,
      data: isAdmin,
    };
    functions.logger.info(successResponse);
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_IS_ADMIN_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
