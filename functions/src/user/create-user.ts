import express, {Request, Response} from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {auth, db} from "../init";
import {
  validateAlphabeticString,
  validateEmail,
  validatePassword,
  validatePhoneNumber}
  from "../utils/validation-util";
import {
  EMAIL_ALREADY_EXISTS_ERROR_MESSAGE,
  ERROR_OCCURRED_CREATING_USER_ERROR_MESSAGE,
  INVALID_EMAIL_ERROR_MESSAGE,
  INVALID_FIRST_NAME_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  INVALID_PHONE_NUMBER_ERROR_MESSAGE,
  INVALID_SUR_NAME_ERROR_MESSAGE,
  PHONE_ALREADY_EXISTS_ERROR_MESSAGE,
} from "../constants/error-message";
import {ErrorResponse} from "../models/custom-responses";
import {buildErrorResponse, buildSuccessResponse} from "../utils/response-util";
import {
  emailAlreadyExists,
  phoneAlreadyExists,
} from "../utils/auth-verification-util";
import {USER_CREATED_SUCCESS_MESSAGE} from "../constants/success-message";

// Instantiates the express application
export const createUserApp = express();

// Adds body parser to parse the json from the body.
createUserApp.use(bodyParser.json());

// Adds cors protection to the request
createUserApp.use(cors({origin: true}));

// Adds the middleware to validate the users auth token
// and retrieve the values held within.
createUserApp.use(getUserCredentialsMiddleware);

createUserApp.post("/", async (req: Request, res: Response) => {
  functions.logger.debug(
    "Calling Create User Function");

  try {
    // Pulling Out Data From Request Body
    const email: string = req.body.email;
    const password: string = req.body.password;
    const confirmPassword: string = req.body.confirmPassword;
    const firstName: string = req.body.firstName;
    const surName: string = req.body.surName;
    const phoneNumber: string = req.body.phoneNumber;
    // Validating Email Address
    if (!validateEmail(email)) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, INVALID_EMAIL_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Validating Password And Confirmation Password
    const maybeValidatedPassword = validatePassword(password);
    const maybeValidatedConfirmPassword = validatePassword(confirmPassword);
    const passwordFailedValidation =
        !maybeValidatedPassword || !maybeValidatedConfirmPassword;
    const passwordsAreSame = password === confirmPassword;
    if (passwordFailedValidation || !passwordsAreSame) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, INVALID_PASSWORD_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Validating First Name
    if (!validateAlphabeticString(firstName)) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, INVALID_FIRST_NAME_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Validating Sur Name
    if (!validateAlphabeticString(surName)) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, INVALID_SUR_NAME_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Validating Phone Number
    if (!validatePhoneNumber(phoneNumber)) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, INVALID_PHONE_NUMBER_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Ensuring Email Doesn't Already Exist
    if (await emailAlreadyExists(email)) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, EMAIL_ALREADY_EXISTS_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Ensuring Phone Number Doesn't Already Exist
    if (await phoneAlreadyExists(phoneNumber)) {
      const errorResponse: ErrorResponse =
          buildErrorResponse(400, PHONE_ALREADY_EXISTS_ERROR_MESSAGE);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
    // Creating User In Auth Layer Of Firebase
    const user = await auth.createUser({
      email: email,
      password: password,
      phoneNumber: phoneNumber,
    });
    // Adding Created User To users Table
    await db.doc(`users/${user.uid}`).set({
      firstName: firstName,
      surName: surName,
      phoneNumber: phoneNumber,
    });
    const successResponse =
        buildSuccessResponse(200, USER_CREATED_SUCCESS_MESSAGE, undefined);
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    functions.logger.error(ERROR_OCCURRED_CREATING_USER_ERROR_MESSAGE, err);
    const errorResponse: ErrorResponse =
        buildErrorResponse(500, ERROR_OCCURRED_CREATING_USER_ERROR_MESSAGE);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
