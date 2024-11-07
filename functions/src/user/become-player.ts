import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { auth, db } from "../init";
import { authIsPlayer, authIsUser } from "../utils/auth-verification-util";
import { ErrorResponse, SuccessResponse } from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_BECOME_PLAYER_ERROR_MESSAGE,
  USER_ALREADY_PLAYER_ERROR_MESSAGE,
} from "../constants/error-message";
import { BECOME_PLAYER_SUCCESS_MESSAGE } from "../constants/success-message";

export const becomePlayerApp = express();

becomePlayerApp.use(bodyParser.json());
becomePlayerApp.use(cors({ origin: true }));
becomePlayerApp.use(getUserCredentialsMiddleware);

becomePlayerApp.post("/", async (req, res) => {
  functions.logger.debug("Calling Create Player Function");

  try {
    if (await authIsUser(req)) {
      if (await authIsPlayer(req)) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: USER_ALREADY_PLAYER_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const uid = req["uid"];
      await db.doc(`players/${uid}`).set({
        teamId: "",
      });
      await auth.setCustomUserClaims(uid, { player: true });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: BECOME_PLAYER_SUCCESS_MESSAGE,
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
      message: ERROR_OCCURRED_BECOME_PLAYER_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
