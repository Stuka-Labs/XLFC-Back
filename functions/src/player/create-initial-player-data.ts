import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsPlayer} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {
  ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE,
  ERROR_OCCURED_PLAYER_DATA_NOT_SUBMITTED,
  ERROR_OCCURED_PLAYER_INITIALS_ALREADY_SET,
} from "../constants/error-message";

// eslint-disable-next-line max-len
import { CREATE_INITIAL_PLAYER_DATA_SUCCESS_MESSAGE } from "../constants/success-message";
import { playerInitialDataAlreadySet } from "../utils/manage-player-util";

// TODO: COME BACK TO THIS
export const SavePlayerInitialDataApp = express();

SavePlayerInitialDataApp.use(bodyParser.json());
SavePlayerInitialDataApp.use(cors({origin: true}));
SavePlayerInitialDataApp.use(getUserCredentialsMiddleware);

// Save Weigh In Data
SavePlayerInitialDataApp.post("/", async (req, res) => {
  functions.logger.debug("Calling Save Player Initial Data Function");

  try {
    if (await authIsPlayer(req)) {
      const uid = req["uid"];

      // Check if the initial data is already set
      if (await playerInitialDataAlreadySet(uid)) {
        const errorResponse: ErrorResponse = {
          statusCode: 409,
          message: ERROR_OCCURED_PLAYER_INITIALS_ALREADY_SET,
        };
        functions.logger.debug(errorResponse);
        res.status(errorResponse.statusCode).json(errorResponse);
        return;
      }

      const startWeight = req.body.startWeight;
      const height = req.body.height;
      const startBmi = req.body.startBmi;
      const playerRef = db.collection("players").doc(uid);
      const player = await playerRef.get();
      await playerRef.set({
        teamId: player.data()?.teamId,
        startWeight: startWeight,
        height: height,
        startBmi: startBmi,
        standardPoints: 0,
        bonusPoints: 0,
        weightChange: 0,
      });

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: CREATE_INITIAL_PLAYER_DATA_SUCCESS_MESSAGE,
        data: undefined,
      };
      functions.logger.info(successResponse);
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
    const message = ERROR_OCCURED_PLAYER_DATA_NOT_SUBMITTED;
    functions.logger.error(message, err);
    res.status(500).json({message: message});
    return;
  }
});
