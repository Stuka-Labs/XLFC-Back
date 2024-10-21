import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {authIsCoach} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURRED_FETCH_COACH_TEAMS_ERROR_MESSAGE,
  NO_TEAMS_FOUND_FOR_COACH_ERROR_MESSAGE,
} from "../constants/error-message";
import {FETCH_COACH_TEAMS_SUCCESS_MESSAGE} from "../constants/success-message";

export const FetchCoachTeamsApp = express();

FetchCoachTeamsApp.use(bodyParser.json());
FetchCoachTeamsApp.use(cors({origin: true}));
FetchCoachTeamsApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coach's team
FetchCoachTeamsApp.get("/", async (req, res) => {
  functions.logger.debug("Calling Fetch All Teams Function");

  try {
    if (await authIsCoach(req)) {
      const coachUid = req["uid"];
      const coachDoc = await db.collection("coaches").doc(coachUid).get();

      const coachData = coachDoc.data();
      const teamIds = coachData?.teamIds || [];

      if (teamIds.length === 0) {
        const errorResponse: ErrorResponse = {
          statusCode: 404,
          message: NO_TEAMS_FOUND_FOR_COACH_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const teamsSnapshot = await db
        .collection("teams")
        .where(firestore.FieldPath.documentId(), "in", teamIds)
        .where("active", "==", true)
        .get();

      const results: DocumentData[] = [];
      teamsSnapshot.forEach((team) => {
        const data = team.data();
        if (data) {
          results.push({
            ...data,
            id: team.id,
          });
        }
      });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: FETCH_COACH_TEAMS_SUCCESS_MESSAGE,
        data: results,
      };
      res.status(successResponse.statusCode).json(successResponse);
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
      message: ERROR_OCCURRED_FETCH_COACH_TEAMS_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
