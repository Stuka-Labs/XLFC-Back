import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import * as functions from "firebase-functions";
import { auth, db } from "../init";
import {
  validateAlphabeticString,
  validateEmail,
  validatePhoneNumber,
} from "../utils/validation-util";
import {
  EMAIL_ALREADY_EXISTS_ERROR_MESSAGE,
  ERROR_OCCURRED_UPDATING_USER_ERROR_MESSAGE,
  INVALID_EMAIL_ERROR_MESSAGE,
  INVALID_FIRST_NAME_ERROR_MESSAGE,
  INVALID_PHONE_NUMBER_ERROR_MESSAGE,
  INVALID_SUR_NAME_ERROR_MESSAGE,
  PHONE_ALREADY_EXISTS_ERROR_MESSAGE,
  USER_UPDATED_SUCCESS_MESSAGE,
} from "../constants/error-message";
import { ErrorResponse } from "../models/custom-responses";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utils/response-util";
import {
  emailAlreadyExists,
  phoneAlreadyExists,
} from "../utils/auth-verification-util";

// Instantiate the express application
export const updateUserApp = express();

// Add body parser to parse the JSON from the body.
updateUserApp.use(express.json());

// Add CORS protection to the request.
updateUserApp.use(cors({ origin: true }));

updateUserApp.put("/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;

  // Log the incoming request
  functions.logger.debug("Request Params:", uid);
  functions.logger.debug("Request Body:", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing or invalid." });
    }

    // Extract data from request body
    const { email, firstName, surName, phoneNumber, displayName, emailVerified } = req.body;

    functions.logger.debug(`Update user details ${email} ${firstName} ${surName} ${phoneNumber} ${displayName} ${emailVerified}`);
    // Retrieve the user document from Firestore
    const userDocRef = db.doc(`users/${uid}`);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      const errorResponse: ErrorResponse = buildErrorResponse(
        404,
        "User not found."
      );
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }

    // Updating Auth User (Firebase Authentication)
    const updateAuthData: any = {};
    if (email) updateAuthData.email = email;
    if (phoneNumber) updateAuthData.phoneNumber = phoneNumber;
    if (displayName) updateAuthData.displayName = displayName;
    if (emailVerified) updateAuthData.emailVerified = emailVerified === "true" ? true : false;
    functions.logger.debug("updateAuthData", updateAuthData);
    if (Object.keys(updateAuthData).length > 0) {
      await auth.updateUser(uid, updateAuthData);
    }

    // Updating Firestore User Document
    const updateFirestoreData: any = {};
    if (email) updateFirestoreData.email = email;
    if (firstName) updateFirestoreData.firstName = firstName;
    if (surName) updateFirestoreData.surName = surName;
    if (phoneNumber) updateFirestoreData.phoneNumber = phoneNumber;
    if (displayName) updateFirestoreData.displayName = displayName;
    if (emailVerified) updateFirestoreData.emailVerified = emailVerified === "true" ? true : false;
    functions.logger.debug("updateFirestoreData", updateFirestoreData);
    if (Object.keys(updateFirestoreData).length > 0) {
      await userDocRef.update(updateFirestoreData, { merge: true });
    }

    const successResponse = buildSuccessResponse(
      200,
      USER_UPDATED_SUCCESS_MESSAGE,
      undefined
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    functions.logger.error(ERROR_OCCURRED_UPDATING_USER_ERROR_MESSAGE, err);
    const errorResponse: ErrorResponse = buildErrorResponse(
      500,
      ERROR_OCCURRED_UPDATING_USER_ERROR_MESSAGE
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
});
