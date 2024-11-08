import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsAdmin} from "../utils/auth-verification-util";
import {playerExists, teamExists} from "../utils/manage-team-util";
import {ACCESS_DENIED_DELETE_PLAYER_TEAM_SERVICE, ERROR_OCCURED_REMOVE_PLAYER_TEAM_MESSAGE, ERROR_OCCURRED_PLAYER_DOESNT_EXIST_ERROR_MESSAGE, TEAM_DOESNT_EXIST_ERROR_MESSAGE} from "../constants/error-message";
import {REMOVE_PLAYER_TEAM_SUCCESS_MESSAGE} from "../constants/success-message";

export const deletePlayerTeamApp = express();

deletePlayerTeamApp.use(bodyParser.json());
deletePlayerTeamApp.use(cors({origin: true}));
deletePlayerTeamApp.use(getUserCredentialsMiddleware);

deletePlayerTeamApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Player Team Function");
  try {
    if (!(authIsAdmin(req))) {
      functions.logger.debug(ACCESS_DENIED_DELETE_PLAYER_TEAM_SERVICE);
      res.status(403).json({message: ACCESS_DENIED_DELETE_PLAYER_TEAM_SERVICE});
      return;
    }
    if (!(await teamExists(req.body.teamId))) {
      functions.logger.debug(TEAM_DOESNT_EXIST_ERROR_MESSAGE);
      res.status(403).json({message: TEAM_DOESNT_EXIST_ERROR_MESSAGE});
      return;
    }
    if (!(await playerExists(req.body.playerId))) {
      functions.logger.debug(ERROR_OCCURRED_PLAYER_DOESNT_EXIST_ERROR_MESSAGE);
      res.status(403).json({message: ERROR_OCCURRED_PLAYER_DOESNT_EXIST_ERROR_MESSAGE});
      return;
    }
    await db.collection("players").doc(req.body.playerId).set({
      teamId: "",
    });
    res.status(200).json({message: REMOVE_PLAYER_TEAM_SUCCESS_MESSAGE});
  } catch (err) {
    const message = ERROR_OCCURED_REMOVE_PLAYER_TEAM_MESSAGE;
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
