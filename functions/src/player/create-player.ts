import * as express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {auth, db} from "../init";

export const createPlayerApp = express();

createPlayerApp.use(bodyParser.json());
createPlayerApp.use(cors({origin: true}));
createPlayerApp.use(getUserCredentialsMiddleware);

createPlayerApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create Player Function");

  try {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const surName = req.body.surName;
    const teamId = req.body.teamId;
    if (!email || !password || !firstName || !surName) {
      res.status(400).json({message: "Invalid Information Provided"});
      return;
    }
    const user = await auth.createUser({
      email,
      password,
    });
    await auth.setCustomUserClaims(user.uid, {player: true});
    await db.doc(`players/${user.uid}`).set({
      firstName: firstName,
      surName: surName,
      teamId: teamId ?? "",
    });
    res.status(200).json({message: "Player Created Successfully"});
  } catch (err) {
    functions.logger.error("Could not create player", err);
    res.status(500).json({message: "Could not create player"});
  }
});
