import express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {auth, db} from "../init";
import {authIsSuperAdmin} from "../utils/auth-verification-util";
import {
  ACCESS_DENIED_ADMIN_CREATION_SERVICE_ERROR_MESSAGE,
  ADMIN_ALREADY_EXISTS_ERROR_MESSAGE,
  ADMIN_CREATION_FAILED_ERROR_MESSAGE,
  INVALID_USER_UID_WITHIN_BODY_ERROR_MESSAGE,
} from "../constants/error-message";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {ADMIN_CREATED_SUCCESS_MESSAGE} from "../constants/success-message";
import {adminExists} from "../utils/manage-admin-util";

export const createAdminApp = express();

createAdminApp.use(bodyParser.json());
createAdminApp.use(cors({origin: true}));
createAdminApp.use(getUserCredentialsMiddleware);

createAdminApp.post("/", async (req, res) => {
  functions.logger.debug("Calling Create Admin Function");

  try {
    if (!(await authIsSuperAdmin(req))) {
      const message = ACCESS_DENIED_ADMIN_CREATION_SERVICE_ERROR_MESSAGE;
      functions.logger.debug(message);
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: message,
      };
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    const superAdminUid: string = req["uid"];
    const userUid: string = req.body.userUid;
    if (!userUid) {
      const message = INVALID_USER_UID_WITHIN_BODY_ERROR_MESSAGE;
      functions.logger.debug(message);
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: message,
      };
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    if (await adminExists(userUid)) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        message: ADMIN_ALREADY_EXISTS_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    await auth.setCustomUserClaims(userUid, {admin: true});
    await db.doc(`admins/${userUid}`).set({
      createdAt: new Date().toISOString(),
      createdByUid: superAdminUid,
    });

    const message = ADMIN_CREATED_SUCCESS_MESSAGE;
    const successResponse: SuccessResponse = {
      statusCode: 200,
      message: message,
      data: userUid,
    };
    functions.logger.info(message);
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const message = ADMIN_CREATION_FAILED_ERROR_MESSAGE;
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: message,
    };
    functions.logger.error(message, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
