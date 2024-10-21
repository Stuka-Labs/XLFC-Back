import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsUser} from "../utils/auth-verification-util";
import {teamExists} from "../utils/manage-team-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ERROR_OCCURRED_FETCH_ALL_COACHES_ON_TEAM_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {
  FETCH_ALL_COACHES_ON_TEAM_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const FetchCoachesOnTeamApp = express();

FetchCoachesOnTeamApp.use(bodyParser.json());
FetchCoachesOnTeamApp.use(cors({origin: true}));
FetchCoachesOnTeamApp.use(getUserCredentialsMiddleware);

// Fetch coaches on team
FetchCoachesOnTeamApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch All Coaches on Team Function");
  try {
    if (await authIsUser(req)) {
      const teamId = req.query.teamId as string;
      if (!(await teamExists(teamId))) {
        const errorResponse: ErrorResponse = {
          statusCode: 400,
          message: TEAM_DOESNT_EXIST_ERROR_MESSAGE,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }
      const coaches: DocumentData[] = [];
      const coachesSnapshot = await db
        .collection("coaches").where("teamIds", "array-contains", teamId).get();
      coachesSnapshot.forEach((coach) => {
        coaches.push({
          ...coach.data(),
          id: coach.id,
        });
      });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: FETCH_ALL_COACHES_ON_TEAM_SUCCESS_MESSAGE,
        data: coaches,
      };
      functions.logger.info(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
    }
  } catch (err) {
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      message: ERROR_OCCURRED_FETCH_ALL_COACHES_ON_TEAM_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
