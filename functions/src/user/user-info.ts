import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {db} from "../init";

export const UserInfoApp = express();

UserInfoApp.use(bodyParser.json());
UserInfoApp.use(cors({origin: true}));
UserInfoApp.use(getUserCredentialsMiddleware);

UserInfoApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling User Type Function");
  try {
    if (!req["uid"]) {
      const message = "Access Denied For User Type Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }

    const user = await db.collection('users').doc(req["uid"]).get()
    const userData = user.data()
    
    const response = {
      first_name: userData?.firstName,
      sur_name: userData?.surName,
      account: undefined as string | undefined
    }

    if (req['admin'])
      response.account = 'admin'
    else if (req['coach'])
      response.account = 'coach'
    else if (req['player'])
      response.account = 'player'
    
    res.status(200).json(response)
  } catch (err) {
    const message = "Could not determine user's account. " +
        "Error Occurred.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
