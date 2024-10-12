import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {
  authIsAdmin} from "../utils/auth-verification-util";
import {deleteCoachTeam} from "../utils/manage-team-util";

export const deleteCoachTeamApp = express();

deleteCoachTeamApp.use(bodyParser.json());
deleteCoachTeamApp.use(cors({origin: true}));
deleteCoachTeamApp.use(getUserCredentialsMiddleware);

deleteCoachTeamApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Coach Team Function");
  try {
    if (authIsAdmin(req)) {
      const coachUid = req.body.coachUid;
      const teamUid = req.body.teamUid;
      const result = await deleteCoachTeam(coachUid, teamUid);
      if (result) {
        const message = "Successfully Removed Coach From Team";
        functions.logger.info(message);
        res.status(200).json({message: message});
        return;
      }
    } else {
      const message = "Access Denied For Remove Coach Team Service";
      functions.logger.info(message);
      res.status(403).json({message: message});
      return;
    }
  } catch (err) {
    const message = "Could not remove coach from team";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
