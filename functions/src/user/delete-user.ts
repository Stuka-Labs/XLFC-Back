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
    } else if (await authIsUser(req)) {
      userUid = req["uid"];

      functions.logger.debug(`User request to delete their own account: ${userUid}`);
    } else {
      functions.logger.warn("Access Denied. Unauthenticated");
      res.status(403).json({ message: "Access Denied. Unauthenticated" });
      return;
    }

    // Delete from users collection
    const userDoc = db.collection("users").doc(userUid);
    const userSnapshot = await userDoc.get();

    if (userSnapshot.exists) {
      await userDoc.delete();
      functions.logger.info(`Deleted Firestore document for user: ${userUid}`);
    } else {
      functions.logger.info(`No Firestore user document found for UID: ${userUid}`);
    }

    // Delete from players collection
    const playerDoc = db.collection("players").doc(userUid);
    const playerSnapshot = await playerDoc.get();

    if (playerSnapshot.exists) {
      await playerDoc.delete();
      functions.logger.info(`Deleted Firestore document for player: ${userUid}`);
    } else {
      functions.logger.info(`No Firestore player document found for UID: ${userUid}`);
    }

    const teamsDoc = db.collection("teams").doc(userUid);
    const teamsSnapshot = await teamsDoc.get();

    if (teamsSnapshot.exists) {
      await teamsDoc.delete();
      functions.logger.info(`Deleted Firestore team document for UID: ${userUid}`);
    } else {
      functions.logger.info(`No Firestore player document found for UID: ${userUid}`);
    }

    // Delete from Firebase Authentication
    await auth.deleteUser(userUid);
    functions.logger.info(`Deleted user from Firebase Authentication: ${userUid}`);

    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    functions.logger.error("Could not delete user", err);
    res.status(500).json({ message: "Could not delete user" });
  }
});
