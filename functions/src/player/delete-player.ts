import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {authIsAdmin} from "../utils/auth-verification-util";
import {playerExists} from "../utils/manage-team-util";

export const deletePlayerApp = express();

deletePlayerApp.use(bodyParser.json());
deletePlayerApp.use(cors({origin: true}));
deletePlayerApp.use(getUserCredentialsMiddleware);

deletePlayerApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Player Function");
  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Delete Player Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    if (!(await playerExists(req.body.playerId))) {
      const message = `Could not find player with given id: 
      ${req.body.playerId}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    await db.collection("players").doc(req.body.playerId).delete();
    res.status(200).json({message: "Player Deleted Successfully"});
  } catch (err) {
    const message = "Could not delete player";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
