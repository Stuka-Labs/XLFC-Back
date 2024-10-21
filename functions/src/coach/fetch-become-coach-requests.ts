import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import {authIsAdmin, authIsSuperAdmin} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
} from "../constants/error-message";
import QuerySnapshot = firestore.QuerySnapshot;
import {
  FETCH_BECOME_COACH_REQUESTS_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const fetchBecomeCoachRequestsApp = express();

fetchBecomeCoachRequestsApp.use(bodyParser.json());
fetchBecomeCoachRequestsApp.use(cors({origin: true}));
fetchBecomeCoachRequestsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for Coaches Teams
fetchBecomeCoachRequestsApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch Become Coach Requests Function");

  try {
    // Checks to see if user request is from an admin or super-admin
    if (await authIsAdmin(req) || await authIsSuperAdmin(req)) {
      // Grabs coach requests that haven't been reviewed yet.
      const coachRequestsSnapshot: QuerySnapshot<DocumentData, DocumentData> =
          await db
            .collection("becomeCoachRequests")
            .where("reviewed", "==", false)
            .get();
      // Pulls the document data out of the request snapshot.
      const becomeCoachRequests
          : QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
      coachRequestsSnapshot.forEach((record) => {
        becomeCoachRequests.push(record);
      });
      // Builds success response, attaches data and sends.
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: FETCH_BECOME_COACH_REQUESTS_SUCCESS_MESSAGE,
        data: becomeCoachRequests,
      };
      functions.logger.info(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
    } else {
      // If user request isn't admin or super-admin
      const errorResponse: ErrorResponse = {
        statusCode: 403,
        message: ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
      };
      functions.logger.debug(errorResponse);
      res.status(errorResponse.statusCode).json(errorResponse);
      return;
    }
  } catch (err) {
    // If Unknown error occurs.
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_FETCH_BECOME_COACH_REQUESTS_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
