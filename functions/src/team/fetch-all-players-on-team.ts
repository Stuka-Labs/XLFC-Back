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
  ERROR_OCCURRED_FETCH_ALL_PLAYERS_ON_TEAM_ERROR_MESSAGE,
  TEAM_DOESNT_EXIST_ERROR_MESSAGE,
} from "../constants/error-message";
import {teamExists} from "../utils/manage-team-util";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {
  FETCH_ALL_PLAYERS_ON_TEAM_SUCCESS_MESSAGE,
} from "../constants/success-message";

export const FetchPlayersOnTeamApp = express();

FetchPlayersOnTeamApp.use(bodyParser.json());
FetchPlayersOnTeamApp.use(cors({origin: true}));
FetchPlayersOnTeamApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
FetchPlayersOnTeamApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Fetch All Players on Team Function");
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
      const players: DocumentData[] = [];
      const playersSnapshot = await db
        .collection("players").where("teamId", "==", teamId).get();
      playersSnapshot.forEach((player) => {
        players.push({
          ...player.data(),
          id: player.id,
        });
      });
      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: FETCH_ALL_PLAYERS_ON_TEAM_SUCCESS_MESSAGE,
        data: players,
      };
      functions.logger.debug(successResponse);
      res.status(successResponse.statusCode).json(successResponse);
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
      message: ERROR_OCCURRED_FETCH_ALL_PLAYERS_ON_TEAM_ERROR_MESSAGE,
    };
    functions.logger.error(errorResponse, err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
});
