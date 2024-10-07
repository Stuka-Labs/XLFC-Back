import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";
import {userSignedIn} from "../utils/auth-verification-util";

export const becomePlayerApp = express();

becomePlayerApp.use(bodyParser.json());
becomePlayerApp.use(cors({origin: true}));
becomePlayerApp.use(getUserCredentialsMiddleware);

becomePlayerApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create Player Function");

  try {
    if (!(await userSignedIn(req))) {
      const message = "Access Denied For Become Player Service";
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }
    const uid = req["uid"];
    await db.doc(`players/${uid}`).set({
      teamId: "",
    });
    res.status(200).json({message: "User Became Player Successfully"});
  } catch (err) {
    functions.logger.error("Could not assign user as player", err);
    res.status(500).json({message: "Could not assign user as player"});
  }
});
