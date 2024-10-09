import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";

export const deleteTeamApp = express();

deleteTeamApp.use(bodyParser.json());
deleteTeamApp.use(cors({origin: true}));
deleteTeamApp.use(getUserCredentialsMiddleware);

// Delete Team
deleteTeamApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete Team Function");

  try {
    if (!(req["uid"] && req["admin"])) {
      const message = "Access Denied For Delete Team Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    const teamUid = req.body.teamUid;
    const team = await db.collection("teams").doc(teamUid).get();
    if (team.exists) {
      await db.collection("teams").doc(team.id).set({
        name: team.data()?.name,
        coachRef: team.data()?.coachRef,
        description: team.data()?.description,
        active: false,
      });
      res.status(200)
        .json({message: "Team Created Successfully"});
    } else {
      res.status(404)
        .json({message: "Unable to locate team with id " + teamUid});
      return;
    }
  } catch (err) {
    const message = "Could not Create Team.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
