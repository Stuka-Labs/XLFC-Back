import { db, auth } from "../init";
import { Request } from "express";
import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import DocumentSnapshot = firestore.DocumentSnapshot;
import DocumentData = firestore.DocumentData;
import { FieldValue } from "firebase-admin/firestore";

/**
 * Determines If The Passed In req contains an authenticated superadmin.
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a superadmin or not.
 */
export const authIsSuperAdmin = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const superAdmin = req["super-admin"];
    if (!uid || !superAdmin) return false;
    const maybeSuperAdmin: DocumentSnapshot<DocumentData, DocumentData> =
      await db.collection("superadmins").doc(uid).get();
    return maybeSuperAdmin.exists;
  } catch (err) {
    return false;
  }
};

/**
 * Determines If The Passed In req contains an authenticated admin.
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is an admin or not.
 */
export const authIsAdmin = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const admin = req["admin"];
    if (!uid || !admin) return false;
    const maybeAdmin: DocumentSnapshot<DocumentData, DocumentData> = await db
      .collection("admins")
      .doc(uid)
      .get();
    return maybeAdmin.exists;
  } catch (err) {
    return false;
  }
};

/**
 * Determines If The Passed In req Contains an Authenticated Coach.
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a coach or not.
 */
export const authIsCoach = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const coach = req["coach"];
    if (!uid || !coach) return false;
    const maybeCoach: DocumentSnapshot<DocumentData, DocumentData> = await db
      .collection("coaches")
      .doc(uid)
      .get();
    return maybeCoach.exists;
  } catch (err) {
    return false;
  }
};

/**
 * Determines If The Passed In req Contains an Authenticated User.
 *
 * @param {Request} req - The user's request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a valid user or not.
 */
export const authIsUser = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const email = req["email"];
    const firstName = req["firstName"];
    const surName = req["surName"];
    functions.logger.debug("[authIsUser] Checking UID:", uid);
    functions.logger.debug("[authIsUser] Checking email:", email);
    functions.logger.debug("[authIsUser] Checking firstName:", firstName);
    functions.logger.debug("[authIsUser] Checking surName:", surName);
    if (!uid) {
      functions.logger.debug("[authIsUser] No UID found in request.");
      return false;
    }

    const maybeUser = await db.collection("users").doc(uid).get();

    if (maybeUser.exists) {
      functions.logger.debug(
        "[authIsUser] User exists in Firestore:",
        maybeUser.data()
      );
      return true;
    } else {
      functions.logger.debug(
        "[authIsUser] No user document found for UID:",
        uid
      );

      // Insert a default document for the user
      const defaultUserDoc = {
        createdAt: FieldValue.serverTimestamp(),
        email: req["email"] || null,
        firstName: req["firstName"] || null,
        surName: req["surName"] || null,
        phoneNumber: req["phoneNumber"] || null,
      };

      await db.collection("users").doc(uid).set(defaultUserDoc);
      functions.logger.info(
        "[authIsUser] Default user document inserted for UID:",
        uid,
        defaultUserDoc
      );

      return true;
    }
  } catch (err) {
    functions.logger.error(
      "[authIsUser] Error verifying user or inserting default document:",
      err
    );
    return false;
  }
};

/**
 * Determines If The Passed In req Contains an Authenticated Player
 *
 * @param {Request} req - The users request obtained via express route.
 * @return {Promise<boolean>} - Whether the user is a valid user or not.
 */
export const authIsPlayer = async (req: Request): Promise<boolean> => {
  try {
    const uid = req["uid"];
    const player = req["player"];
    if (!uid || !player) return false;
    const maybePlayer: DocumentSnapshot<DocumentData, DocumentData> = await db
      .collection("players")
      .doc(uid)
      .get();
    return maybePlayer.exists;
  } catch (err) {
    return false;
  }
};

export const emailAlreadyExists = async (value: string): Promise<boolean> => {
  try {
    const maybeUser = await auth.getUserByEmail(value);
    return maybeUser != null;
  } catch (err) {
    return false;
  }
};

export const phoneAlreadyExists = async (value: string): Promise<boolean> => {
  try {
    console.log(`Checking if phone number exists: ${value}`);

    // Check in Firestore
    const maybeUser = await db
      .collection("users")
      .where("phoneNumber", "==", value)
      .get();

    if (!maybeUser.empty) {
      console.log(
        "Phone number found in Firestore. User IDs:",
        maybeUser.docs.map((doc) => doc.id)
      );
      return true;
    }

    // Check in Firebase Authentication
    try {
      const authUser = await auth.getUserByPhoneNumber(value);
      console.log(
        `Phone number found in Firebase Authentication. UID: ${authUser.uid}`
      );
      return true;
    } catch (error) {
      if ((error as { code: string }).code === "auth/user-not-found") {
        console.log("Phone number not found in Firebase Authentication.");
        return false;
      } else {
        console.error("Error checking Firebase Authentication:", error);
        throw error;
      }
    }
  } catch (err) {
    console.error("Error occurred while checking phone number:", err);
    return false;
  }
};
export const getUserIdByPhoneNumber = async (
  value: string
): Promise<string | null> => {
  try {
    console.log(`Getting userId if phone number exists for user: ${value}`);

    // Check in Firestore
    const maybeUser = await db
      .collection("users")
      .where("phoneNumber", "==", value)
      .get();

    if (!maybeUser.empty) {
      console.log(
        "Phone number found in Firestore. User IDs:",
        maybeUser.docs.map((doc) => doc.id)
      );
      return maybeUser.docs[0].id;
    }

    // Check in Firebase Authentication
    try {
      const authUser = await auth.getUserByPhoneNumber(value);
      console.log(
        `Phone number found in Firebase Authentication. UID: ${authUser.uid}`
      );
      return authUser.uid;
    } catch (error) {
      if ((error as { code: string }).code === "auth/user-not-found") {
        console.log("Phone number not found in Firebase Authentication.");
        return null;
      } else {
        console.error("Error checking Firebase Authentication:", error);
        throw error;
      }
    }
  } catch (err) {
    console.error("Error occurred while checking phone number:", err);
    return null;
  }
};
