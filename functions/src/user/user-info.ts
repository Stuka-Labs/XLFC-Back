import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsUser} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_USER_INFO_ERROR_MESSAGE,
} from "../constants/error-message";
import {USER_INFO_SUCCESS_MESSAGE} from "../constants/success-message";

export const UserInfoApp = express();

UserInfoApp.use(bodyParser.json());
UserInfoApp.use(cors({origin: true}));
UserInfoApp.use(getUserCredentialsMiddleware);

UserInfoApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling User Type Function");
  try {
    if (!req["uid"]) {
      const message = "Access Denied For User Type Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (await authIsUser(req)) {
      const user = await db.collection("users").doc(req["uid"]).get();
      const userData = user.data();

      const response = {
        userData: userData,
        accountType: undefined as string | undefined,
      };

      if (req["super-admin"]) {
        response.accountType = "super-admin";
      } else if (req["admin"]) {
        response.accountType = "admin";
      } else if (req["coach"]) {
        response.accountType = "coach";
      } else if (req["player"]) {
        response.accountType = "player";
      }

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: USER_INFO_SUCCESS_MESSAGE,
        data: response,
      };
      functions.logger.info(successResponse);
      res.status(200).json(response);
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
      message: ERROR_OCCURRED_USER_INFO_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
