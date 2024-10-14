import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {coachExists} from "../utils/manage-team-util";
import {authIsAdmin} from "../utils/auth-verification-util";

export const createTeamApp = express();

createTeamApp.use(bodyParser.json());
createTeamApp.use(cors({origin: true}));
createTeamApp.use(getUserCredentialsMiddleware);

// Create Team
createTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create Team Function");

  try {
    if (!(authIsAdmin(req))) {
      const message = "Access Denied For Create Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamName = req.body.teamName;
    const coachUid = req.body.coachUid;
    const description = req.body.description;
    if (coachUid) {
      if (!(await coachExists(coachUid))) {
        const message = "Could not find coach with uid " + coachUid;
        functions.logger.debug(message);
        res.status(403).json({message: message});
        return;
      }
      // const coachRef = db.collection("coaches").doc(coachUid);
      await db.collection("teams").doc().set({
        name: teamName,
        // coachRef: coachRef,
        coachUid: coachUid,
        description: description,
        active: true,
      });
      res.status(200).json({message: "Team Created Successfully"});
    } else {
      await db.collection("teams").doc().set({
        name: teamName,
        coachRef: null,
        description: description,
        active: true,
      });
      res.status(200).json({message: "Team Created Successfully"});
    }
    return;
  } catch (err) {
    const message = "Could not Create Team. Error Occurred During Creation";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
