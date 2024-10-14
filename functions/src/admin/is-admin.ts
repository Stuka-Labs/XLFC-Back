import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {authIsAdmin, authIsUser} from "../utils/auth-verification-util";

export const IsAdminApp = express();

IsAdminApp.use(bodyParser.json());
IsAdminApp.use(cors({origin: true}));
IsAdminApp.use(getUserCredentialsMiddleware);

// Fetch weigh in data for given player on coaches team
IsAdminApp.get("/", async (req, res) => {
  functions.logger.debug(
    "Calling Is Admin Function");
  try {
    if (!authIsUser(req)) {
      const message = "Access Denied For Is Admin Service";
      functions.logger.debug(message);
      res.status(403).json({message: message});
      return;
    }
    let isAdmin = false;
    isAdmin = !!(authIsAdmin(req));
    res.status(200).json({data: isAdmin});
  } catch (err) {
    const message = "Could not determine whether user is admin or not. " +
        "Error Occurred.";
    functions.logger.error(message, err);
    res.status(500).json({message: message});
  }
});
