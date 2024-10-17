import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import {getUserCredentialsMiddleware} from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import {auth, db} from "../init";
import {authIsAdmin, authIsUser} from "../utils/auth-verification-util";

export const deleteUserApp = express();

deleteUserApp.use(bodyParser.json());
deleteUserApp.use(cors({origin: true}));
deleteUserApp.use(getUserCredentialsMiddleware);

deleteUserApp.delete("/", async (req, res) => {
  functions.logger.debug(
    "Calling Delete User Function");
  try {
    let userUid = "";
    if (await authIsAdmin(req)) {
      userUid = req.body.userUid;
      await db.collection("users").doc(userUid).delete();
      await auth.deleteUser(userUid);
      res.status(200).json({message: "Successfully Deleted"});
    } else if (await authIsUser(req)) {
      userUid = req["uid"];
      await db.collection("users").doc(userUid).delete();
      await auth.deleteUser(userUid);
      res.status(200).json({message: "Successfully Deleted"});
    } else {
      res.status(403).json({message: "Access Denied. Unauthenticated"});
    }
  } catch (err) {
    functions.logger.error("Could not delete user", err);
    res.status(500).json({message: "Could not delete user"});
  }
});
