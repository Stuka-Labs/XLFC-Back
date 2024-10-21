import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsPlayer} from "../utils/auth-verification-util";
import {ErrorResponse, SuccessResponse} from "../models/custom-responses";
import {ACCESS_DENIED_UNAUTHORIZED_ERROR_MESSAGE} from "../constants/error-message";
import {CREATE_INITIAL_PLAYER_DATA_SUCCESS_MESSAGE} from "../constants/success-message";

// TODO: COME BACK TO THIS
export const SavePlayerInitialDataApp = express();

SavePlayerInitialDataApp.use(bodyParser.json());
SavePlayerInitialDataApp.use(cors({origin: true}));
SavePlayerInitialDataApp.use(getUserCredentialsMiddleware);

// Save Weigh In Data
SavePlayerInitialDataApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Save Player Initial Data Function");

  try {
    if (await authIsPlayer(req)) {
      const uid = req["uid"];
      if (await playerInitialDataAlreadySet(uid)) {

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
      });

      const successResponse: SuccessResponse = {
        statusCode: 200,
        message: CREATE_INITIAL_PLAYER_DATA_SUCCESS_MESSAGE,
        data: undefined,
      };
      functions.logger.info(successResponse);
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
    const message = "Could not submit initial player data.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
