import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {
  authIsAdmin,
  authIsCoach} from "../utils/auth-verification-util";
import {assignCoachTeam} from "../utils/manage-team-util";

export const assignCoachTeamApp = express();

assignCoachTeamApp.use(bodyParser.json());
assignCoachTeamApp.use(cors({origin: true}));
assignCoachTeamApp.use(getUserCredentialsMiddleware);

assignCoachTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Assign Coach Team Function");

  try {
    if (authIsCoach(req)) {
      const coachUid = req["uid"];
      const teamUid = req.body.teamUid;
      const result = await assignCoachTeam(coachUid, teamUid);
      if (result) {
        const message = "Successfully Assign Coach To Team";
        functions.logger.info(message);
        res.status(200).json({message: message});
        return;
      }
    } else if (await authIsAdmin(req)) {
      const coachUid = req.body.coachUid;
      const teamUid = req.body.teamUid;
      const result = await assignCoachTeam(coachUid, teamUid);
      if (result) {
        const message = "Successfully Assign Coach To Team";
        functions.logger.info(message);
        res.status(200).json({message: message});
        return;
      }
    } else {
      const message = "Access Denied For Assign Coach Team Service";
      functions.logger.info(message);
      res.status(403).json({message: message});
      return;
    }
  } catch (err) {
    const message = "Could not assign coach to team";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
