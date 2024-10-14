import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {auth, db} from "../init";

export const createUserApp = express();

createUserApp.use(bodyParser.json());
createUserApp.use(cors({origin: true}));
createUserApp.use(getUserCredentialsMiddleware);

createUserApp.post("/", async (req, res) => {
  functions.logger.debug(
    "Calling Create User Function");

  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName;
    const surName = req.body.surName;
    // const phoneNumber = req.body.phoneNumber;
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
    }
    // if (!phoneNumber) {
    //   res.status(400).json({message: "Invalid Phone Number"});
    //   return;
    // }
    const user = await auth.createUser({
      email,
      password,
    });

    await db.doc(`users/${user.uid}`).set({
      firstName: firstName,
      surName: surName,
      // phoneNumber: phoneNumber,
    });
    res.status(200).json({message: "User Created Successfully"});
  } catch (err) {
    functions.logger.error("Could not create user", err);

    if (err instanceof Error){
      res.status(500).json({ message: err.message });
      return
    }

    res.status(500).json({message: "Could not create user"});
  }
});
