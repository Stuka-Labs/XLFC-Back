import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import * as functions from "firebase-functions";
import { auth, db } from "../init";
import { authIsAdmin, authIsUser } from "../utils/auth-verification-util";

export const deleteUserApp = express();

deleteUserApp.use(bodyParser.json());
deleteUserApp.use(cors({ origin: true }));
deleteUserApp.use(getUserCredentialsMiddleware);

deleteUserApp.delete("/", async (req, res) => {
  functions.logger.debug("Calling Delete User Function");
  try {
    let userUid = "";

    if (await authIsAdmin(req)) {
      userUid = req.body.userUid;

      functions.logger.debug(`Admin request to delete user: ${userUid}`);
      // Delete Firestore document
      const userDoc = db.collection("users").doc(userUid);
      const docSnapshot = await userDoc.get();
      if (docSnapshot.exists) {
        await userDoc.delete();
        functions.logger.info(
          `Deleted Firestore document for user: ${userUid}`
        );
      } else {
        functions.logger.warn(
          `No Firestore document found for user: ${userUid}`
        );
      }

      // Delete from Firebase Authentication
      await auth.deleteUser(userUid);
      functions.logger.info(
        `Deleted user from Firebase Authentication: ${userUid}`
      );
      res.status(200).json({ message: "Successfully Deleted" });
    } else if (await authIsUser(req)) {
      userUid = req["uid"];

      functions.logger.debug(
        `User request to delete their own account: ${userUid}`
      );
      // Delete Firestore document
      const userDoc = db.collection("users").doc(userUid);
      const docSnapshot = await userDoc.get();
      if (docSnapshot.exists) {
        await userDoc.delete();
        functions.logger.info(
          `Deleted Firestore document for user: ${userUid}`
        );
      } else {
        functions.logger.warn(
          `No Firestore document found for user: ${userUid}`
        );
      }

      // Delete from Firebase Authentication
      await auth.deleteUser(userUid);
      functions.logger.info(
        `Deleted user from Firebase Authentication: ${userUid}`
      );
      res.status(200).json({ message: "Successfully Deleted" });
    } else {
      functions.logger.warn("Access Denied. Unauthenticated");
      res.status(403).json({ message: "Access Denied. Unauthenticated" });
    }
  } catch (err) {
    functions.logger.error("Could not delete user", err);
    res.status(500).json({ message: "Could not delete user" });
  }
});
