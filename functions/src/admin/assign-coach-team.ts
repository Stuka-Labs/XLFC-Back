import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";

export const assignCoachTeamApp = express();

assignCoachTeamApp.use(bodyParser.json());
assignCoachTeamApp.use(cors({origin: true}));
assignCoachTeamApp.use(getUserCredentialsMiddleware);

assignCoachTeamApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Assign Coach Team Function");

  try {
    if (!(req["uid"] && req["admin"])) {
      const message = "Access Denied For Assign Coach Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }

    const coachUid = req.body.coachUid;
    const teamId = req.body.teamId;
    const teamRef = db.collection("teams").doc(teamId);
    const team = await teamRef.get();
    if (!team.exists) {
      const message = `Could not find a team with the given id: ${teamId}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const coachRef = db.collection("coaches").doc(coachUid);
    const coach = await coachRef.get();
    if (!coach.exists) {
      const message = `Could not find a coach with the given id: ${coachUid}`;
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamIds = coach.data()?.teamIds;
    await db.collection("coaches").doc(coachUid).set({
      teamIds: [...teamIds, teamId],
    });
    res.status(200).json({message: "Coach Assigned to Team Successfully"});
  } catch (err) {
    const message = "Could not assign coach to team";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
