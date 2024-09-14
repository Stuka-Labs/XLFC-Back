import * as express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {auth, db} from "../init";

export const createManagerApp = express();

createManagerApp.use(bodyParser.json());
createManagerApp.use(cors({origin: true}));
createManagerApp.use(getUserCredentialsMiddleware);

createManagerApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create Manager Function");

  try {
    if (!(req["uid"] && req["admin"])) {
      const message = "Access Denied For Manager Creation Service";
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const surName = req.body.surName;
    const canEdit = req.body.canEdit;
    if (!email || !password || !firstName || !surName) {
      res.status(400).json({message: "Invalid Information Provided"});
      return;
    }
    const user = await auth.createUser({
      email,
      password,
    });
    await auth.setCustomUserClaims(user.uid, {manager: true});
    await db.doc(`managers/${user.uid}`).set({
      firstName: firstName,
      surName: surName,
      canEdit: canEdit ?? false,
    });
    res.status(200).json({message: "Manager Create Successfully"});
  } catch (err) {
    const message = "Could not create manager";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
