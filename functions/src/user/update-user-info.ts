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
updateUserApp.use(bodyParser.json());

// Add CORS protection to the request.
updateUserApp.use(cors({ origin: true }));

updateUserApp.put("/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;
  functions.logger.debug(`Calling Update User Function ${uid}`);
  try {
    // Extract UID from request parameters

    auth
      .getUser(uid)
      .then((userRecord) => {
        console.log("User Object:", userRecord);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // Extract data from request body
    const { email, firstName, surName, phoneNumber, displayName, emailVerified } = req.body;


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

    // // Validating Email Address
    // if (email && !validateEmail(email)) {
    //   const errorResponse: ErrorResponse = buildErrorResponse(
    //     400,
    //     INVALID_EMAIL_ERROR_MESSAGE
    //   );
    //   res.status(errorResponse.statusCode).json(errorResponse);
    //   return;
    // }

    // // Ensuring Email Doesn't Already Exist
    // if (email && (await emailAlreadyExists(email))) {
    //   const errorResponse: ErrorResponse = buildErrorResponse(
    //     400,
    //     EMAIL_ALREADY_EXISTS_ERROR_MESSAGE
    //   );
    //   res.status(errorResponse.statusCode).json(errorResponse);
    //   return;
    // }

    // // Validating First Name
    // if (firstName && !validateAlphabeticString(firstName)) {
    //   const errorResponse: ErrorResponse = buildErrorResponse(
    //     400,
    //     INVALID_FIRST_NAME_ERROR_MESSAGE
    //   );
    //   res.status(errorResponse.statusCode).json(errorResponse);
    //   return;
    // }

    // // Validating Sur Name
    // if (surName && !validateAlphabeticString(surName)) {
    //   const errorResponse: ErrorResponse = buildErrorResponse(
    //     400,
    //     INVALID_SUR_NAME_ERROR_MESSAGE
    //   );
    //   res.status(errorResponse.statusCode).json(errorResponse);
    //   return;
    // }

    // // Validating Phone Number
    // if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    //   const errorResponse: ErrorResponse = buildErrorResponse(
    //     400,
    //     INVALID_PHONE_NUMBER_ERROR_MESSAGE
    //   );
    //   res.status(errorResponse.statusCode).json(errorResponse);
    //   return;
    // }

    // // Ensuring Phone Number Doesn't Already Exist
    // if (phoneNumber && (await phoneAlreadyExists(phoneNumber))) {
    //   const errorResponse: ErrorResponse = buildErrorResponse(
    //     400,
    //     PHONE_ALREADY_EXISTS_ERROR_MESSAGE
    //   );
    //   res.status(errorResponse.statusCode).json(errorResponse);
    //   return;
    // }

    // Updating Auth User (Firebase Authentication)
    const updateAuthData: any = {};
    if (email) updateAuthData.email = email;
    if (phoneNumber) updateAuthData.phoneNumber = phoneNumber;
    if (displayName) updateAuthData.displayName = displayName;
    if (emailVerified) updateAuthData.emailVerified = emailVerified === "true" ? true : false;
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
    if (emailVerified) updateAuthData.emailVerified = emailVerified === "true" ? true : false;

    if (Object.keys(updateFirestoreData).length > 0) {
      await userDocRef.update(updateFirestoreData);
    }

    const successResponse = buildSuccessResponse(
      200,
      USER_UPDATED_SUCCESS_MESSAGE,
      undefined
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    functions.logger.error(ERROR_OCCURRED_UPDATING_USER_ERROR_MESSAGE, err);
    const errorResponse: ErrorResponse = buildErrorResponse(
      500,
      ERROR_OCCURRED_UPDATING_USER_ERROR_MESSAGE
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
