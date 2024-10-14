import express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import cors from "cors";
import { getUserCredentialsMiddleware } from "../auth/auth.middleware";
import { auth, db } from "../init";
// import { authIsAdmin } from "../utils/auth-verification-util";
import { authIsUser } from "../utils/auth-verification-util";

export const createAdminApp = express();

createAdminApp.use(bodyParser.json());
createAdminApp.use(cors({ origin: true }));
createAdminApp.use(getUserCredentialsMiddleware);

createAdminApp.post("/", async (req, res) => {
  functions.logger.debug("Calling Create Admin Function");

  try {
    // if (!(await authIsAdmin(req))) {
    if (!(await authIsUser(req))) {
      const message = "Access Denied For Admin Creation Service";
      functions.logger.debug(message);
      res.status(403).json({ message });
      return;
    }

    if (req['admin']){
      res.status(401).json({ message: "You're already an admin" });
      return
    }

    // Bypass TypeScript error by casting req to 'any'
    const uid = req['uid']

    if (!uid) {
      res.status(401).json({ message: "Unauthorized: No UID found" });
      return;
    }

    await auth.setCustomUserClaims(uid, { admin: true });
    await db.doc(`admins/${uid}`).set({
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Admin Created Successfully" });
  } catch (err) {
    const message = "Admin Failed To Be Created Successfully";
    functions.logger.error(message, err);
    res.status(500).json({ message });
  }
});
