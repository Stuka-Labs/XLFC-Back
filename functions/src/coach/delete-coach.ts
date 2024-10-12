import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {
  authIsAdmin} from "../utils/auth-verification-util";
import {deleteCoach} from "../utils/manage-coach-util";

export const deleteCoachApp = express();

deleteCoachApp.use(bodyParser.json());
deleteCoachApp.use(cors({origin: true}));
deleteCoachApp.use(getUserCredentialsMiddleware);

deleteCoachApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Coach Team Function");
  try {
    if (authIsAdmin(req)) {
      const coachUid = req.body.coachUid;
      const result = await deleteCoach(coachUid);
      if (result) {
        const message = "Successfully Deleted Coach";
        functions.logger.info(message);
        res.status(200).json({message: message});
        return;
      } else {
        const message = "Failed to delete coach.";
        functions.logger.info(message);
        res.status(400).json({message: message});
      }
    } else {
      const message = "Access Denied For Delete Coach Service";
      functions.logger.info(message);
      res.status(403).json({message: message});
      return;
    }
  } catch (err) {
    const message = "Could not delete coach";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
