import * as express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import {auth, db} from "../init";

export const createAdminApp = express();

createAdminApp.use(bodyParser.json());
createAdminApp.use(cors({origin: true}));
createAdminApp.use(getUserCredentialsMiddleware);

createAdminApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create Admin Function");

  try {
    // TODO: Temporary fix - switch back to admin only
    if (!(req["uid"])) {
      const message = "Access Denied For Admin Creation Service";
      functions.logger.debug(message);
      res.status(403).json({message});
      return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName;
    const surName = req.body.surName;
    const phoneNumber = req.body.phoneNumber;
    if (!email) {
      res.status(400).json({message: "Invalid Email Address"});
      return;
    }
    if ((!password || !confirmPassword) || !(password === confirmPassword) ) {
      res.status(400).json({message: "Invalid Password"});
    }
    if (!firstName) {
      res.status(400).json({message: "Invalid First Name"});
      return;
    }
    if (!surName) {
      res.status(400).json({message: "Invalid Sur Name"});
      return;
    }
    if (!phoneNumber) {
      res.status(400).json({message: "Invalid Phone Number"});
      return;
    }
    const user = await auth.createUser({
      email,
      password,
    });
    await auth.setCustomUserClaims(user.uid, {admin: true});
    await db.doc(`admins/${user.uid}`).set({
      firstName: firstName,
      surName: surName,
      phoneNumber: phoneNumber,
    });
    res.status(200).json({message: "Admin Created Successfully"});
  } catch (err) {
    const message = "Admin Failed To Be Created Successfully";
    functions.logger.error(message, err);
    res.status(403).json({message: message});
  }
});
